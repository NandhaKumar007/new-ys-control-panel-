export const environment = {
  production: true,
  ws_url: 'https://yourstore.io/api',
  img_baseurl: 'https://yourstore.io/api/',
  limited_product_count: 50,
  default_img_count: 15,
  variant_img_count: 30,
  quill_config: {
    modules: {
      syntax: false,
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        // ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }], 
        [{ 'size': ['small', false, 'large', 'huge'] }],  
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'color': [] }, { 'background': [] }],       
        // [{ 'font': [] }],
        [{ 'align': [] }],
        ['clean'],                           
        ['link', 'image']                
      ]
    }
  },
  config_data: {
    free_package_id: "5f4cd131573e9a1e680239f1",
    premium_package_id: "5f4cd4c5573e9a1e68023a04",
    dinamic_order_id: ["60b52edf58954c13bf58b5a2", "61dd3dda459e175b4e42736f"],
    high_paid_packages: ["5f4cd235573e9a1e680239fd", "5f4cd434573e9a1e68023a03", "5f4cd4c5573e9a1e68023a04"], // starter, growth, premium
    hungover_id: "5fbcac07fd6ce3538c2cf355",
    uru_id: "60805f647ee34b5a03e4ca0d",
    stone_acres_id: "624fd5a8a96c721d4bef5bc5"
  },
  keep_login: false,
  base_url: "https://yourstore.io/login",
  razorpay_payment_url: "https://api.razorpay.com/v1/checkout/embedded",
  razorpay_redirect_url: "https://yourstore.io/api/others/razorpay_store_payment/5ceb9eb971f2cb809646edd2"
};