// app/authors/page.tsx
import Image from "next/image";
import Link from "next/link";
import { fetchWithCache } from "../../lib/api";
import { endpoints } from "../../lib/config";
import { Author } from "../../lib/types";
import { FaTwitter, FaLinkedin, FaFacebook } from "react-icons/fa";

async function fetchAuthorsData(): Promise<Author[]> {
  try {
    const data = await fetchWithCache<Author[]>(endpoints.authors);
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

const getImageUrl = (img?: string | null) => {
  if (!img) return "/placeholder-author.jpg";
  if (img.startsWith("http")) return img;
  return `https://lawngreen-dragonfly-304220.hostingersite.com/storage/${img}`;
};

export default async function AuthorsPage() {
  const authors = await fetchAuthorsData();

  return (
    <main className="p-10 mt-32 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
          Meet Our <span className="bg-gradient-to-r from-amber-500 to-pink-500 bg-clip-text text-transparent">Authors</span>
        </h1>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          Creative storytellers and thinkers shaping our community 🌟
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {authors.map((author) => (
          <Link
            key={author.id}
            href={`/authors/${author.id}`}
            className="group relative bg-white/70 backdrop-blur-xl rounded-3xl   hover:-translate-y-2 transition-all duration-500 overflow-hidden"
          >
            {/* Avatar */}
            <div className="flex justify-center mt-14">
              <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden ring-4 ring-amber-400/60 group-hover:ring-pink-400/80 transition">
                <Image
                  src={getImageUrl(author.image)}
                  alt={`${author.first_name} ${author.last_name}`}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition">
                {author.first_name} {author.last_name}
              </h2>
              <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                {author.bio}
              </p>

              {/* Socials */}
              <div className="flex justify-center gap-5 mt-5">
                <FaTwitter className="text-gray-400 hover:text-sky-500 cursor-pointer text-lg transition" />
                <FaLinkedin className="text-gray-400 hover:text-blue-700 cursor-pointer text-lg transition" />
                <FaFacebook className="text-gray-400 hover:text-blue-600 cursor-pointer text-lg transition" />
              </div>

              {/* Button */}
              <div className="mt-6">
                <span className="inline-block px-6 py-2 text-sm font-medium rounded-full bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow-md hover:shadow-lg hover:scale-105 transition">
                  View Profile →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
