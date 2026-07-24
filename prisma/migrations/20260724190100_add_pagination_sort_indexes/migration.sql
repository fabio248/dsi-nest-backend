-- CreateIndex
CREATE INDEX "pet_specie_id_idx" ON "pet"("specie_id");

-- CreateIndex
CREATE INDEX "pet_user_id_idx" ON "pet"("user_id");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_last_name_idx" ON "user"("last_name");
