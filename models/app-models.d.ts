declare namespace AppModels {
    type TUserSchema = import("./user.model").TUserSchema;
    type TProductSchema= import("./product.model").TProductSchema;
    
    export type UserObject = import("mongoose").HydratedDocumentFromSchema<TUserSchema>;
    export type ProductObject = import("mongoose").HydratedDocumentFromSchema<TProductSchema>;
   
   
}