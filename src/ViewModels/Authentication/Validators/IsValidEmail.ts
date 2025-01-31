export default function isValidEmail(email: string): boolean {
    console.log('isValidEmail >>>', email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}