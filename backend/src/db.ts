import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.DB_LINK;
    if (!mongoURI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    // MongoDB'ye bağlan
    const conn = await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');

    // Veritabanı bağlantısı başarılı ise db'yi al
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Veritabanı bağlantısı sağlanamadı.');
    }

  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Uygulamayı hata durumunda kapat
  }
};

export default connectDB;
