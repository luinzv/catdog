import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Base de datos conectada");
    } catch (error) {
        console.error("Error en conectar con DB ", error);
        process.exit(1);
    }
}

export default connectDB;
