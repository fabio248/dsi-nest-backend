import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uudi } from 'uuid';
import { plainToInstance } from 'class-transformer';
import { CreateFileDto } from './dto/input/create-file.input';
import { PrismaService } from '../database/database.service';
import { FolderResponseDto, FileResponseDto } from './dto/response';
import { PetsService } from './../pets/pets.service';
import { GenericArgs } from '../shared/args/generic.args';

@Injectable()
export class FilesService {
  private readonly s3Cliente: S3;
  private readonly region = this.configService.get('aws.region');
  private readonly accessKeyId = this.configService.get<string>('aws.key');
  private readonly secretKey = this.configService.get('aws.secret');
  private readonly bucketName = this.configService.get('aws.bucket');
  private readonly EXPIRE_5MIN = 300;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly petService: PetsService,
  ) {
    this.s3Cliente = new S3({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretKey,
      },
      region: this.region,
    });
  }

  getUrlToUploadFile(key: string, folderName: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: `${folderName}/${key}`,
    });

    return getSignedUrl(this.s3Cliente, command, {
      expiresIn: this.EXPIRE_5MIN,
    });
  }

  async getUrlToGetFile(key: string, folderId: number): Promise<string> {
    const folder = await this.prisma.folder.findUnique({
      where: { id: folderId },
    });

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: `${folder.name}/${key}`,
    });

    return getSignedUrl(this.s3Cliente, command, {
      expiresIn: this.EXPIRE_5MIN,
    });
  }

  async findOrCreateFolderByPetId(petId: number): Promise<FolderResponseDto> {
    let folder;

    const pet = await this.prisma.pet.findUnique({
      where: { id: petId },
      select: { folder: true, name: true },
    });

    folder = pet.folder;

    if (!folder) {
      const folderName = `${uudi()}-${pet.name}`;

      folder = await this.prisma.folder.create({
        data: { name: folderName, pets: { connect: { id: petId } } },
      });
    }

    return plainToInstance(FolderResponseDto, folder);
  }

  //TODO: add validation when pet does not have medicalHistory
  async create(
    createFileDto: CreateFileDto,
    petId: number,
  ): Promise<FileResponseDto> {
    const { mimetype } = createFileDto;
    const { medicalHistoryId } = await this.petService.findOneById(petId);
    const folder = await this.findOrCreateFolderByPetId(petId);
    const fileName = await this.createKeyNameForFile(petId, mimetype);

    const file = await this.prisma.file.create({
      data: { name: fileName, folderId: folder.id, medicalHistoryId },
    });

    const url = await this.getUrlToUploadFile(fileName, folder.name);

    const response = {
      ...file,
      url,
      petId,
    };

    return plainToInstance(FileResponseDto, response);
  }

  async findAll(args: GenericArgs): Promise<FileResponseDto[]> {
    const { skip, take } = args;
    const response = [];
    const listFiles = await this.prisma.file.findMany({ skip, take });

    for (const file of listFiles) {
      const fileWithUrl = {
        ...file,
        url: await this.getUrlToGetFile(file.name, file.folderId),
      };
      response.push(plainToInstance(FileResponseDto, fileWithUrl));
    }

    return response;
  }

  async findOne(id: number): Promise<FileResponseDto> {
    const file = await this.prisma.file.findUnique({ where: { id } });

    const response = {
      ...file,
      url: await this.getUrlToGetFile(file.name, file.folderId),
    };

    return plainToInstance(FileResponseDto, response);
  }

  async createKeyNameForFile(petId: number, mimetype: string) {
    const pet = await this.petService.findOneById(petId);

    return `${uudi()}-${pet.name}.${mimetype.split('/')[1]}`;
  }
}
