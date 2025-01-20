/* eslint-disable jsx-a11y/img-redundant-alt */
import React from "react";

// Impor gambar lokal dari src/assets
import photo1 from ".//assets/sosmi.jpg";
import photo2 from ".//assets/mineral.jpg";
import photo3 from ".//assets/nasi.jpg";
import photo4 from ".//assets/risol.jpg";
import photo5 from ".//assets/dimsum.jpg";
import photo6 from ".//assets/basreng.jpeg";
import photo7 from ".//assets/kripca.jpeg";
import photo8 from ".//assets/kripik-usus.jpeg";
import photo9 from ".//assets/popmie.jpeg";
import photo10 from ".//assets/aoka.jpg";
import photo11 from ".//assets/piscok.jpg";
import photo12 from ".//assets/mochi.jpg";

function PhotoPage() {
  const photos = [photo1, photo2, photo3, photo4, photo5, photo6, photo7, photo8, photo9, photo10, photo11, photo12]; // Array gambar lokal

  return (
    <section className="py-20 bg-snavy">
      <div className="container mx-auto px-4">
        {/* Title Section */}
        <h2 className="text-4xl font-extrabold text-center text-white mb-8">
          Galeri
        </h2>

        {/* Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {photos.map((photo, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-lg shadow-lg"
            >
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className="w-full h-48 sm:h-60 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay Effect */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 transition-opacity duration-500 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PhotoPage;
