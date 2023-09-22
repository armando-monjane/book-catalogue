export interface BookUpdate {
    id?: number; // option to avoid error when updating object having id value: Cannot update identity column 'id'
    title: string;
    isbn: string;
    author: string;
};