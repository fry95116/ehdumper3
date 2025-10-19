/**
 * Tailwind configuration for gallerydumper3-web
 * Added safelist to prevent purging of dynamically-generated classes
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: ["w-1/6","w-1/4","w-1/3","w-1/2","w-1/6",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
