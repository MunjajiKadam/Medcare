export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white text-center py-6 mt-20 border-t border-gray-800 dark:border-gray-900">
      <p className="text-gray-300 dark:text-gray-400">© {new Date().getFullYear()} MedCare. All rights reserved.</p>
    </footer>
  );
}
