import { BookingModel, CreateBookingParams, Booking } from "@/models/BookingModel";

export class BookingPresenter {
  private model: BookingModel;

  constructor() {
    this.model = new BookingModel();
  }

  async createBooking(params: CreateBookingParams): Promise<Booking> {
    try {
      return await this.model.createBooking(params);
    } catch (error) {
      console.error("Error creating booking:", error);
      throw new Error("Failed to create booking. Please try again.");
    }
  }

  async loadUserBookings(): Promise<Booking[]> {
    try {
      return await this.model.getUserBookings();
    } catch (error) {
      console.error("Error loading bookings:", error);
      throw new Error("Failed to load bookings. Please try again.");
    }
  }
}
