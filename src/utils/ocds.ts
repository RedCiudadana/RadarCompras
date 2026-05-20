import { OCDS_PREFIX } from "../types/ocds";


export function getNog(ocid: string) {
    return ocid.replace(`${OCDS_PREFIX}-`, '');
}