import { motion } from "framer-motion";
import { fadeIn } from "../../motion";
import { FaPeopleCarry, FaLightbulb, FaHandshake } from "react-icons/fa";
import { GoArrowLeft } from "react-icons/go";

const AboutUs = () => {
    return (
        <div className="bg-gray-50 min-h-screen p-2 md:p-12 font-sans text-gray-700">

            <div className="w-fit bg-gray-200 p-2 rounded-lg shadow-sm mb-6">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center text-lg text-red-600"
                >
                    <GoArrowLeft />
                    <h2 className="text-xl font-bold text-gray-800 ml-4">Back</h2>
                </button>
            </div>
            <h1 className="text-4xl font-bold text-center mb-10 text-red-600">About Us</h1>

            {/* Our Story Section */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 1 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaPeopleCarry className="text-red-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">Our Story</h2>
                </div>
                <p className="ml-8 mb-4">
                    Adsterra started with a friendship and grew to be a successful business that still retains its core values: putting great emphasis on
                    teamwork, transparency, commitment, consistency, quality, and always being ready to support and help both clients and colleagues.
                </p>
                <p className="ml-8">
                    Founded in 2013 by professional affiliate marketers and webmasters with over 20 years of experience, Adsterra has developed into a
                    trusted name in the industry. What started as a shared vision has now blossomed into a platform that blends technology and human
                    intelligence to deliver excellence.
                </p>
            </motion.section>

            {/* Vision Section */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 2 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaLightbulb className="text-yellow-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">Our Vision</h2>
                </div>
                <p className="ml-8 mb-4">
                    &quot;We were friends at school and university, brought together by our shared interest in technology and marketing, as well as the desire to
                    find the best way to attain self-realization and success. While striving to grow financially, we didn’t want to get tangled up in the
                    complex corporate culture.&quot;
                </p>
                <p className="ml-8">
                    Adsterra’s founders wanted to create something new, both for themselves and for the market. The result is a company with a professional
                    IT department, experienced account managers, and a team of dedicated employees who strive to provide outstanding support and solutions
                    for advertisers and publishers.
                </p>
            </motion.section>

            {/* Our Mission Section */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 4 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-10 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaLightbulb className="text-green-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">Our Mission</h2>
                </div>
                <p className="ml-8 mb-4">
                    We connect advertisers and publishers of all sizes globally, helping them grow their capital, develop their skills, and improve as
                    professionals to ensure a successful present and future.
                </p>
                <p className="ml-8">
                    By setting high traffic and service quality standards, we contribute to the development of the adtech market. Through our innovative
                    products, we aim to foster growth, share knowledge, and collaborate with the community to build a brighter future for all.
                </p>
            </motion.section>

            {/* Recognition Section */}
            <motion.section
                initial={fadeIn("up", null).initial}
                whileInView={fadeIn("up", 3 * 2).animate}
                viewport={{ once: false, amount: 0.2 }}
                className="mb-52 p-6 bg-white rounded-lg shadow-md"
            >
                <div className="flex items-center mb-4">
                    <FaHandshake className="text-blue-500 text-3xl mr-3" />
                    <h2 className="text-2xl font-semibold text-gray-800">Industry Recognition</h2>
                </div>
                <p className="ml-8 mb-4">
                    Today, Adsterra is a well-known brand with a strong reputation and has been recognized by numerous bloggers and affiliates as one of the
                    top adtech platforms. Our blend of innovative technology and human intelligence makes us a trusted partner in the industry.
                </p>
                <p className="ml-8">
                    We believe that our dedication to excellence and support for both advertisers and publishers is what sets us apart and drives our
                    success.
                </p>
            </motion.section>
        </div>
    );
};

export default AboutUs;
