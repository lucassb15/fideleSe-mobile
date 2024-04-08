/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    fontFamily: {
      'inter-regular': ['Inter_400Regular'],
      'inter-medium': ['Inter_500Medium'],
      'inter-semi-bold': ['Inter_600SemiBold'],
      'inter-black': ['Inter_900Black'],
      'nunito-sans-black': ['NunitoSans_900Black'],
    },
  },
}
