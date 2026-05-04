export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <div className="text-white font-extrabold text-xl mb-1">
              <span className="text-violet-400">קוגנט</span>
            </div>
            <p className="text-sm">למידה חכמה יותר עם AI</p>
          </div>

          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">מדיניות פרטיות</a>
            <a href="#" className="hover:text-white transition-colors">תנאי שימוש</a>
            <a href="mailto:info@cognet.ai" className="hover:text-white transition-colors">צור קשר</a>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
          © 2024 קוגנט. כל הזכויות שמורות.
        </div>
      </div>
    </footer>
  );
}
