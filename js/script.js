document.addEventListener('DOMContentLoaded', () => {
    // 1. Fetch and Load Dynamic Content
    const loadContent = async () => {
        try {
            const response = await fetch('data/content.json');
            const data = await response.json();

            // Profile Section
            if (data.profile) {
                const profileImg = document.getElementById('profile-img');
                const profileName = document.getElementById('profile-name');
                const profileSubtitle = document.getElementById('profile-subtitle');
                const bookingText = document.getElementById('booking-text');

                if (profileImg) profileImg.src = data.profile.image;
                if (profileName) profileName.textContent = data.profile.name;
                if (profileSubtitle) profileSubtitle.textContent = data.profile.subtitle;
                if (bookingText) bookingText.textContent = data.profile.bookingText;
            }

            // Action Buttons
            const buttonsContainer = document.getElementById('buttons-container');
            if (buttonsContainer && data.buttons) {
                buttonsContainer.innerHTML = ''; // Clear placeholder
                data.buttons.forEach(btn => {
                    const a = document.createElement('a');
                    a.target = "_blank";
                    a.href = btn.url;
                    a.className = `${btn.style} flex items-center justify-between p-5 rounded-2xl font-semibold text-lg group w-full ${btn.style === 'gold-btn' ? 'shadow-lg font-extrabold' : ''}`;
                    
                    a.innerHTML = `
                        <div class="flex items-center gap-4">
                            <div class="bg-white/${btn.style === 'gold-btn' ? '10' : '5'} p-2 rounded-lg group-hover:bg-white/${btn.style === 'gold-btn' ? '20' : '10'} transition-colors">
                                <i class="${btn.icon} text-2xl ${btn.style === 'glass-card' ? 'text-yellow-500' : ''}"></i>
                            </div>
                            <span>${btn.text}</span>
                        </div>
                        <i class="fa-solid ${btn.style === 'gold-btn' ? 'fa-arrow-right' : 'fa-chevron-right'} ${btn.style === 'gold-btn' ? 'group-hover:translate-x-1' : 'opacity-40 group-hover:opacity-100 group-hover:translate-x-1'} transition-all"></i>
                    `;
                    buttonsContainer.appendChild(a);
                });
            }

            // Portfolio Gallery
            const portfolioGrid = document.getElementById('portfolio-grid');
            if (portfolioGrid && data.portfolio) {
                portfolioGrid.innerHTML = '';
                data.portfolio.forEach((item, index) => {
                    const div = document.createElement('div');
                    div.className = "gallery-item overflow-hidden rounded-2xl glass-card lightbox-btn group relative";
                    div.innerHTML = `
                        <div class="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20 cursor-pointer">
                            <i data-lucide="zoom-in" class="text-white w-8 h-8"></i>
                        </div>
                        <img src="${item.image}" alt="${item.alt}" class="gallery-img w-full h-full object-cover">
                    `;
                    
                    // Attach Lightbox event to new elements
                    div.addEventListener('click', () => {
                        updateLightbox(index, data.portfolio);
                        lightbox.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                    
                    portfolioGrid.appendChild(div);
                });
            }

            // About Section
            if (data.about && document.getElementById('about-text')) {
                document.getElementById('about-text').textContent = data.about.description;
            }

            // Social Links
            if (data.social) {
                const insta = document.getElementById('social-instagram');
                const tiktok = document.getElementById('social-tiktok');
                if (insta) insta.href = data.social.instagram;
                if (tiktok) tiktok.href = data.social.tiktok;
            }

            // Re-initialize UI Libraries after dynamic content
            if (typeof lucide !== 'undefined') lucide.createIcons();
            if (typeof AOS !== 'undefined') AOS.refresh();

        } catch (error) {
            console.error('Error loading content:', error);
        }
    };

    // Initialize Lucide Icons (Initial)
    if (typeof lucide !== 'undefined') lucide.createIcons();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            easing: 'ease-out-cubic'
        });
    }

    // Lightbox Logic Enhancements
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = lightbox.querySelector('.lightbox-img');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let currentIndex = 0;
    let currentGallery = [];

    const updateLightbox = (index, items) => {
        currentIndex = index;
        currentGallery = items || currentGallery;
        const item = currentGallery[currentIndex];
        if (item) {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = item.image || item.src; // Handle both JSON and static fallback
                lightboxImg.style.opacity = '1';
            }, 200);
        }
    };

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox(newIndex);
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const newIndex = (currentIndex + 1) % currentGallery.length;
        updateLightbox(newIndex);
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target !== lightboxImg && !e.target.closest('.lightbox-nav')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') lightbox.click();
    });

    // Set current year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Start Loading
    loadContent();
});

