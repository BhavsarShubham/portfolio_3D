import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  const formRef = useRef < HTMLFormElement > (null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState({
    show: false,
    type: "success", // or "error"
    message: "",
  });


  const [errors, setErrors] = useState < { [key: string]: boolean } > ({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ show: true, type, message });
    setTimeout(() => setPopup({ ...popup, show: false }), 3000);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: boolean } = {};
    if (!form.name.trim()) newErrors.name = true;
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) newErrors.email = true;
    if (!form.message.trim()) newErrors.message = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("access_key", "a3811932-d3d0-433c-80cf-7a43a61a1d46");
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("message", form.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        showPopup("success", "Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        showPopup("error", data.message || "Submission failed.");
      }
    } catch (err) {
      console.error("Web3Forms error:", err);
      showPopup("error", "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden relative">
      {/* Popup Notification */}
      {popup.show && (
        <div
          className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-lg z-50 text-sm ${popup.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
        >
          {popup.message}
        </div>
      )}

      {/* Contact Form */}
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-12 flex flex-col gap-8">
          {/* Name */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="What's your good name?"
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium ${errors.name ? "border-red-500" : "border-transparent"
                }`}
            />
          </label>

          {/* Email */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="What's your email address?"
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium ${errors.email ? "border-red-500" : "border-transparent"
                }`}
            />
          </label>

          {/* Message */}
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Your Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="What do you want to say?"
              rows={7}
              className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-2 font-medium resize-none ${errors.message ? "border-red-500" : "border-transparent"
                }`}
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary hover:bg-[#2b2d52] transition-all"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </motion.div>

      {/* Earth Canvas */}
      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
