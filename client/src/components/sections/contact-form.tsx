import { useState } from "react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Send, CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", projectType: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Nama, email, dan pesan wajib diisi.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      await addDoc(collection(db, "messages"), {
        ...form,
        read: false,
        createdAt: serverTimestamp(),
      });
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", projectType: "", message: "" });
    } catch (e) {
      console.error(e);
      setError("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm transition-all";

  return (
    <section id="konsultasi" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Form */}
              <div className="p-10">
                <h2 className="text-3xl font-bold font-serif mb-4">Konsultasikan Proyek Anda</h2>
                <p className="text-[#4A4A4A] mb-8">Ceritakan tentang proyek Anda, dan tim kami akan menghubungi Anda untuk diskusi lebih lanjut.</p>

                {submitted ? (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center text-center py-10 gap-4"
                  >
                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Pesan Terkirim!</h3>
                    <p className="text-gray-500">Terima kasih telah menghubungi kami. Tim kami akan segera menghubungi Anda.</p>
                    <button onClick={() => setSubmitted(false)}
                      className="mt-2 text-sm text-[#B8860B] hover:underline font-medium">
                      Kirim pesan lain
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                      <div className="bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg px-4 py-3">{error}</div>
                    )}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap *</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Masukkan nama lengkap Anda" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="Masukkan alamat email Anda" className={inputClass} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor Telepon</label>
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="Masukkan nomor telepon Anda" className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Jenis Proyek</label>
                      <select value={form.projectType} onChange={e => setForm(f => ({ ...f, projectType: e.target.value }))}
                        className={inputClass}>
                        <option value="">Pilih Jenis Proyek</option>
                        <option value="residential">Residensial</option>
                        <option value="commercial">Komersial</option>
                        <option value="interior">Interior</option>
                        <option value="furniture">Furniture</option>
                        <option value="konstruksi">Konstruksi</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Pesan *</label>
                      <textarea rows={4} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Ceritakan tentang proyek Anda" className={`${inputClass} resize-none`} required />
                    </div>
                    <button type="submit" disabled={isSubmitting}
                      className="w-full bg-[#FFD700] text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#FFD700]/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? "Mengirim..." : (
                        <><Send className="w-4 h-4" /> Kirim Pesan</>
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Image */}
              <div className="relative hidden lg:block">
                <img src="https://images.unsplash.com/photo-1567016432779-094069958ea5"
                  alt="Interior design" className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
