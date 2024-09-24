import React, { useState, useEffect } from 'react';
import { projects, icons } from '@/data';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const Projects = () => {
  const [windowWidth, setWindowWidth] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleProjectClick = (id: string) => {
    router.push(`/${id}`);
  };

  return (
    <div className='py-20 relative min-h-screen flex flex-col justify-center items-center space-y-10 w-full'>
      <div className="w-full flex flex-col items-center text-center mx-auto">
        <h1 className="font-inconsolata lg:text-fontLG1 font-normal leading-tight text-[37px]">
          <span>What I've Been Working On</span>
        </h1>
        <h1 className="font-inconsolata lg:text-fontLG2 font-light leading-tight pb-8 xsm:pb-2 text-[20px]">
          <span>Certain projects aren’t listed due to confidentiality.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5 xsm:p-1">
        {projects.map((project, index) => {
          const [currentImageIndex, setCurrentImageIndex] = useState(0);
          const { ref, inView } = useInView({
            triggerOnce: true,
            threshold: 0.1,
          });

          const isLeftCard = index % 2 === 0;
          const initialX = isLeftCard ? '-25%' : '25%'; // Shorter animation distance

          const nextImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % project.image.length);
          };

          const prevImage = (e: React.MouseEvent) => {
            e.stopPropagation();
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + project.image.length) % project.image.length);
          };

          return (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, x: initialX }}
              animate={{
                opacity: inView ? [0, 0.5, 1] : 0, // Animating opacity to gradually increase
                x: inView ? 0 : initialX,
              }}
              transition={{
                x: { duration: 0.5, ease: 'easeOut' }, // Animation for movement
                opacity: { duration: 0.5, ease: 'easeOut', delay: 0.25 }, // Opacity gradually increases towards the end
              }}
              key={index}
              onClick={() => handleProjectClick(project.id)}
              className="bg-lightGray border-[2px] shadow-bottom-left border-borderProject rounded-2xl p-5 flex flex-col relative 
              filter grayscale hover:grayscale-0 transition duration-500 w-full max-w-[400px] h-[470px] cursor-pointer"
            >

              <div
                className='bg-grayISH w-full h-[224px] rounded-2xl border-black flex justify-center items-center mb-4 relative overflow-hidden'
                onClick={(e) => e.stopPropagation()}
              >
                <div className='relative w-full h-full'>
                  {project.image.map((imgSrc, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={imgSrc}
                      alt={project.title}
                      className={`absolute h-full w-full object-cover rounded-2xl transition-opacity duration-500 
                        ${imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    />
                  ))}
                </div>

                <div className="absolute bottom-4 right-4 flex space-x-1">
                  <div
                    className='border border-border bg-darkGray rounded-full w-7 h-7 flex justify-center items-center xxsm:w-6 xxsm:h-6'
                    onClick={prevImage}
                  >
                    <img src="./icons/left.svg" alt="Left Arrow" className="w-6 h-6 flex items-center justify-center xxsm:w-5 xxsm:h-5" />
                  </div>
                  <div
                    className='border border-border bg-darkGray rounded-full w-7 h-7 flex justify-center items-center xxsm:w-6 xxsm:h-6'
                    onClick={nextImage}
                  >
                    <img src="./icons/right.svg" alt="Right Arrow" className="w-6 h-6 flex items-center justify-center xxsm:w-5 xxsm:h-5" />
                  </div>
                </div>
              </div>

              <h1 className='text-2xl font-bold font-inconsolata xxsm:text-xl'>
                {project.title}
              </h1>

              <h1 className='text-xl font-inconsolata text-fontLG2 font-normal xxsm:text-base'>
                {project.description}
              </h1>

              <div className='absolute bottom-16 xxsm:bottom-[3.5rem] left-3'>
                {project.technologies.map((techId, techIndex) => {
                  const techIcon = icons.find(icon => icon.id === techId);
                  const translationX = windowWidth > 380 ? 35 * techIndex + 5 : 26 * techIndex + 5;

                  return (
                    <div
                      key={techIndex}
                      style={{
                        transform: `translateX(${translationX}px)`,
                        zIndex: `${project.technologies.length - techIndex}`,
                        position: 'absolute',
                      }}
                      className='border border-border bg-darkGray rounded-full w-11 h-11 flex justify-center items-center filter grayscale 
                      xxsm:w-9 xxsm:h-9'
                    >
                      {techIcon && (
                        <img src={techIcon.icon} alt={techIcon.name} className="w-6 h-6 xxsm:w-5 xxsm:h-5" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="absolute bottom-6 right-6 flex space-x-1">
                {project.GitHubLink && (
                  <a 
                    href={project.GitHubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <img src="./icons/github.svg" alt="GitHub" className="w-8 h-8 xxsm:w-6 xxsm:h-6" />
                  </a>
                )}
                {project.YouTubeLink && (
                  <a 
                    href={project.YouTubeLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()} 
                  >
                    <img src="./icons/youtube.svg" alt="YouTube" className="w-8 h-8 xxsm:w-6 xxsm:h-6" />
                  </a>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
