// export default[

//     {
//         link:'https://buy.stripe.com/test_4gM00k1nw2uUdYT0dgg3603',
//         price:7.99,
//         priceId:'price_1Rr106K1GIuAf3wtxx69883C',
//         duration:'Monthly'
//     },
//     {
//         link:'https://buy.stripe.com/test_aFa8wQaY63yYdYT5xAg3600',
//         price:49.00,
//         priceId:'price_1Rr0LsK1GIuAf3wtNrIroprg',
//         duration:'Yearly'
//     }
// ]

export const planData = [
    {
      name: 'Free',
      price: 0,
      priceId: null,
      link: '#',
      duration: 'Forever',
      isCurrent: true, // This can be made dynamic based on user's actual subscription
      features: [
        'Access to 20 practice questions',
        '1 mock interview per month',
        'Limited company question sets',
        'Basic performance report',
        'Email support',
      ],
    },
    {
      name: 'Monthly Pro',
      price: 7.99,
      priceId: 'price_1Rr106K1GIuAf3wtxx69883C', // Your Price ID
      link: 'https://buy.stripe.com/test_4gM00k1nw2uUdYT0dgg3603', // Your Link
      duration: 'Monthly',
      isCurrent: false,
      features: [
        'Access to all 1000+ practice questions',
        'Unlimited mock interviews',
        'Full access to all company question sets',
        'Detailed performance & progress reports',
        'Priority email support',
        'Help center access',
      ],
    },
    {
      name: 'Yearly Pro',
      price: 49.00,
      priceId: 'price_1Rr0LsK1GIuAf3wtNrIroprg', // Your Price ID
      link: 'https://buy.stripe.com/test_aFa8wQaY63yYdYT5xAg3600', // Your Link
      duration: 'Yearly',
      isCurrent: false,
      features: [
        'Everything in Monthly Pro',
        'AI-powered interview feedback',
        'Exclusive access to new question sets',
        'Community access & leaderboards',
        'Priority email & phone support',
        'Save over 50% with this plan!',
      ],
    },
  ];
  
  export default planData;