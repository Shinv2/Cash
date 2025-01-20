export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000'  // Assuming your NestJS backend runs on port 3000
};
// Энэ нь environment.ts файлын агуулга бөгөөд хөгжүүлэлтийн үед ашиглагдаг орчны тохиргоог тодорхойлдог
//production: false: Энэ нь Angular-ийг хөгжүүлэлтийн горимд ажиллуулж байгааг зааж өгдөг. 
//Хэрэв энэ утгыг true болговол үйлдвэрлэлийн орчинд (production mode) ажиллана.