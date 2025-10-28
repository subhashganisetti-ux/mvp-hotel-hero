import { HotelModel, SearchParams, Hotel } from "@/models/HotelModel";

export class HotelPresenter {
  private model: HotelModel;

  constructor() {
    this.model = new HotelModel();
  }

  async loadAllHotels(): Promise<Hotel[]> {
    try {
      return await this.model.getAllHotels();
    } catch (error) {
      console.error("Error loading hotels:", error);
      throw new Error("Failed to load hotels. Please try again.");
    }
  }

  async searchHotels(params: SearchParams): Promise<Hotel[]> {
    try {
      return await this.model.searchHotels(params);
    } catch (error) {
      console.error("Error searching hotels:", error);
      throw new Error("Failed to search hotels. Please try again.");
    }
  }

  async getHotelDetails(id: string): Promise<Hotel | null> {
    try {
      return await this.model.getHotelById(id);
    } catch (error) {
      console.error("Error getting hotel details:", error);
      throw new Error("Failed to load hotel details. Please try again.");
    }
  }

  formatPrice(price: number): string {
    return `$${price.toFixed(2)}`;
  }

  calculateTotalPrice(pricePerNight: number, checkIn: string, checkOut: string): number {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return pricePerNight * nights;
  }
}
