import mongoose,{ Schema } from "mongoose";

const AdminusersSchema = new Schema(
    {
        name: String,
        email: String,
    },
    {

        timestamps: true

    }

)

const Adminusers = mongoose.models.Adminusers || mongoose.model("Adminusers",AdminusersSchema);
export default Adminusers;