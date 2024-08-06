import { appConfig } from '@/config';
import PinataSdk from '@pinata/sdk';

const pinataSdk=new PinataSdk(appConfig.constants.PINATA_API_KEY, appConfig.constants.PINATA_API_SECRET);
export default pinataSdk;