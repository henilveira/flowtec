export type User = {
    id?: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    isAdminContabilidade: boolean;
    dateJoined: Date;
    profilePicture: string;
}
export type UpdateUser = {
    id?: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    profile_picture: File | null;
}