import { OtganizationPart } from "./OtganizationPart"
import { TypeOfFire } from "./TypeOfFire"

export interface Fire {
    id: number
    type: string
    dateStart?: string
    dateEnd?: string
    description: string
    typeOfFire: TypeOfFire
    typeOfFireId: number
    otganizationPart: OtganizationPart
    otganizationPartId: number
  }