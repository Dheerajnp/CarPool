import { RequestHandler } from "express";
import { DriverInteractor } from "../../application/interfaces/usecases/driverInteractor";


export class driverController{
    constructor(public readonly interactor:DriverInteractor){}

    uploadLicense:RequestHandler = async(req, res) => {
        console.log(req.body);
        console.log("license uploading");
        const { userId } = req.params;
        console.log(req.body)
        const { licenseFrontUrl,licenseBackUrl,vehicleBrand,vehiceModel,vehicleNumber,rcDocumentUrl } = req.body;
        
        try {
          const { message } = await this.interactor.licenseUploadInteractor({userId,licenseFrontUrl,licenseBackUrl,vehicleBrand,vehiceModel,vehicleNumber,rcDocumentUrl});
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
}