//import { medicalTypes } from 'mypet/constants/medicalConstants';
import { medicalTypes } from '../constants/medicalConstants';

export const getMedicalIcon = (type) => {
  if (medicalTypes[type] !== undefined)
    return medicalTypes[type].icon;
  else
    return medicalTypes.Misc.icon;
};
