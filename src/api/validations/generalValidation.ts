import { mandatoryFieldsValidationReturn } from '../../types/validation'

export const mandatoryFieldsValidation = (obj: any, mandatoryFields: string[]): mandatoryFieldsValidationReturn => {
    const missingFields: string[] = []

    mandatoryFields.forEach(field => {
        if(obj[field] === null || obj[field] === undefined)
            missingFields.push(field)
    })

    if(missingFields.length) 
        return {
            isValid: false,
            missingFields: missingFields
        }

    return {
        isValid: true,
    }
}
