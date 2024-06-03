export interface StrategicReport {
    startDate?: string;        // Fecha de inicio del rango
    endDate?: string;          // Fecha de fin del rango
    totalAmount: string;      // Monto total vendido
    totalProducts: number;    // Total de productos vendidos
    topProducts: TopProduct[]; // Lista de los 5 productos más vendidos
    currentDate: string;      // Fecha de generación del reporte
}

export interface TopProduct {
    productName: string;     // Nombre del producto
    quantitySold: number;    // Cantidad vendida del producto
    amountSold: string;      // Monto vendido del producto
}

export interface TacticalReport {

}