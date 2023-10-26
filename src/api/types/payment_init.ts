export type InitializePaymentInput = {
  price: number;
  email: string;
  firstName: string;
  lastName: string;
  metadata: {
    full_name: string;
  };
};
