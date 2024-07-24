import { RequestHandler } from "express";
import { DriverInteractor } from "../../application/interfaces/usecases/driverInteractor";


export class driverController{
    constructor(public readonly interactor:DriverInteractor){}

    uploadLicense:RequestHandler = async(req, res) => {
        const { userId } = req.params;
        const { licenseFrontUrl,licenseBackUrl,vehicleBrand,vehicleModel,vehicleNumber,rcDocumentUrl } = req.body;
        
        try {
          const { message } = await this.interactor.licenseUploadInteractor({userId,licenseFrontUrl,licenseBackUrl,vehicleBrand,vehicleModel,vehicleNumber,rcDocumentUrl});
          return res.status(200).json({ message });
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      getDriverDetails:RequestHandler = async (req, res) => {
        const { driverId } =req.body.data;
        console.log(req.body);
        try {
          const result = await this.interactor.getDriverInteractor({driverId});
          return res.status(result.status).json(result);
        } catch (error) {
          return res.status(500).json({message  : "Internal server error"});
        }
      }

      editLicenseInfo:RequestHandler = async(req, res) => {

        const { licenseBackUrl, licenseFrontUrl,driverId } = req.body;
        console.log(req.body);
        try {
          const { message, driver,status } = await this.interactor.saveLicenseInfoInteractor({driverId, licenseBackUrl, licenseFrontUrl});
          return res.status(status).json({ message, driver });
        } catch (error) {
          return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      editDriverInfo:RequestHandler = async (req,res)=>{
        const {name, phone } = req.body;
        const { driverId } = req.params;
        console.log(name, phone, driverId);
        console.log(req.body)
        try{
          const { message, status } = await this.interactor.editDriverInfoInteractor({name,phone,driverId});
          return res.status(status).json({ message,status }); 
        }catch (error) {
        return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      addVehicle:RequestHandler = async (req,res)=>{
        const { brand, model, vehicleNumber,rcDocumentUrl } = req.body;
        const { driverId } = req.params;
        console.log(brand, model, vehicleNumber, driverId , rcDocumentUrl);
        console.log(req.body)
        try{
          const { message, status } = await this.interactor.addVehicleInteractor({brand, model, vehicleNumber, driverId,rcDocumentUrl});
          return res.status(status).json({ message,status }); 
        }catch (error) {
        return res.status(500).json({message  : "Internal server error",status:500});
        }
      }

      deleteVehicle:RequestHandler = async (req,res)=>{
        const { vehicleId } = req.params;
        const { driverId } = req.body;
        console.log(vehicleId, driverId);
        try{
          const { message, status } = await this.interactor.deleteVehicleInteractor(vehicleId, driverId);
          return res.status(status).json({ message,status }); 
        }catch (error) {
        return res.status(500).json({message  : "Internal server error",status:500});
        }
      }
}