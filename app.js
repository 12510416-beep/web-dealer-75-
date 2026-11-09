(() => {
    const STORE_KEY = 'drivemotoState';
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'drivemoto123';

    const starterBikes = [
        {
            id: 'nmax-turbo',
            name: 'NMAX Turbo',
            brand: 'Yamaha',
            type: 'Matic',
            cc: '155',
            price: 38000000,
            stock: 8,
            colors: ['Hitam', 'Merah', 'Biru', 'Putih'],
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
            badge: 'Terlaris',
            description: 'Skuter premium untuk perjalanan harian yang nyaman dan bertenaga.'
        },
        {
            id: 'aerox-155',
            name: 'Aerox 155',
            brand: 'Yamaha',
            type: 'Matic',
            cc: '155',
            price: 32000000,
            stock: 6,
            colors: ['Hitam', 'Merah', 'Abu-abu'],
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85',
            badge: 'Sporty',
            description: 'Tampilan agresif dengan karakter berkendara yang sporty.'
        },
        {
            id: 'pcx-160',
            name: 'PCX 160',
            brand: 'Honda',
            type: 'Matic',
            cc: '160',
            price: 33000000,
            stock: 5,
            colors: ['Putih', 'Hitam', 'Merah'],
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
            badge: 'Premium',
            description: 'Skuter elegan untuk mobilitas harian dengan posisi berkendara santai.'
        },
        {
            id: 'vario-160',
            name: 'Vario 160',
            brand: 'Honda',
            type: 'Matic',
            cc: '160',
            price: 28000000,
            stock: 9,
            colors: ['Hitam', 'Merah', 'Putih'],
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85',
            badge: 'Pilihan hemat',
            description: 'Desain modern dan praktis untuk kebutuhan sehari-hari.'
        },
        {
            id: 'r15',
            name: 'R15',
            brand: 'Yamaha',
            type: 'Sport',
            cc: '155',
            price: 42000000,
            stock: 3,
            colors: ['Biru', 'Hitam'],
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=85',
            badge: 'Sport',
            description: 'Motor sport berkarakter dengan posisi berkendara yang dinamis.'
        },
        {
            id: 'cbr150r',
            name: 'CBR150R',
            brand: 'Honda',
            type: 'Sport',
            cc: '150',
            price: 38000000,
            stock: 4,
            colors: ['Merah', 'Hitam'],
            image: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=85',
            badge: 'Sport',
            description: 'Pilihan motor sport untuk pengendara yang menyukai desain tajam.'
        }
    ];

    const starterPromos = [
        {
            id: 'promo-1',
            title: 'Paket pembelian pilihan',
            discount: 'DP ringan',
            description: 'Konsultasikan pilihan uang muka dan cicilan sesuai kebutuhan Anda.',
            valid: 'Syarat dan ketentuan berlaku.'
        },
        {
            id: 'promo-2',
            title: 'Kesempatan test drive',
            discount: 'Gratis booking',
            description: 'Jadwalkan kesempatan mencoba motor pilihan sebelum membeli.',
            valid: 'Unit dan jadwal mengikuti ketersediaan.'
        }
    ];

    // =========================================
    // PENYIMPANAN DATA
    // =========================================

    function readState() {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STORE_KEY) || 'null'
            );

            if (!saved) {
                return {
                    bikes: starterBikes,
                    bookings: [],
                    leads: [],
                    promos: starterPromos
                };
            }

            const savedBikes = Array.isArray(saved.bikes)
                ? saved.bikes
                : [];

            const bikes = savedBikes.length
                ? savedBikes.map(bike => {
                    const oldColors = Array.isArray(bike.colors)
                        ? bike.colors
                        : [];

                    const legacyStock = oldColors.reduce(
                        (sum, color) => sum + (Number(color?.stock) || 0),
                        0
                    );

                    return {
                        ...bike,
                        id: String(bike.id ?? `bike-${Date.now()}`),
                        price: Number(bike.price) || 0,
                        stock: Number.isFinite(Number(bike.stock))
                            ? Number(bike.stock)
                            : legacyStock,
                        colors: oldColors
                            .map(color =>
                                typeof color === 'string'
                                    ? color
                                    : (color?.name || color?.color || '')
                            )
                            .filter(Boolean),
                        image: bike.image || 'assets/motorcycle-placeholder.svg'
                    };
                })
                : starterBikes;

            return {
                bikes,
                bookings: Array.isArray(saved.bookings)
                    ? saved.bookings
                    : [],
                leads: Array.isArray(saved.leads)
                    ? saved.leads
                    : [],
                promos: Array.isArray(saved.promos)
                    ? saved.promos
                    : starterPromos
            };

        } catch (error) {
            console.warn(
                'Data DriveMoto tidak dapat dibaca. Menggunakan data awal.',
                error
            );

            return {
                bikes: starterBikes,
                bookings: [],
                leads: [],
                promos: starterPromos
            };
        }
    }

    let state = readState();

    function saveState() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(state));
            return true;

        } catch (error) {
            alert(
                'Penyimpanan browser penuh. Coba gunakan foto berukuran lebih kecil atau hapus data lama.'
            );

            console.error(error);
            return false;
        }
    }

    // =========================================
    // FUNGSI BANTUAN
    // =========================================

    const rupiah = value =>
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0
        }).format(Number(value) || 0);

    const totalStock = bike =>
        Number.isFinite(Number(bike.stock))
            ? Number(bike.stock)
            : (bike.colors || []).reduce(
                (n, c) => n + (Number(c?.stock) || 0),
                0
            );

    const byId = id =>
        state.bikes.find(
            bike => String(bike.id) === String(id)
        );

    const escapeHTML = value =>
        String(value ?? '').replace(
            /[&<>"']/g,
            char => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[char])
        );

    const makeId = prefix =>
        `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    // =========================================
    // LOGIN ADMIN
    // =========================================

    function isAdmin() {
        return sessionStorage.getItem('drivemotoAdmin') === 'true';
    }

    function login(username, password) {
        if (
            username === ADMIN_USER &&
            password === ADMIN_PASS
        ) {
            sessionStorage.setItem('drivemotoAdmin', 'true');
            return true;
        }

        return false;
    }

    function logout() {
        sessionStorage.removeItem('drivemotoAdmin');
        window.location.href = 'admin.html';
    }

    // =========================================
    // GAMBAR MOTOR
    // =========================================

    function imageHTML(bike, className = '') {
        const src = escapeHTML(
            bike.image || 'assets/motorcycle-placeholder.svg'
        );

        return `<img
            class="${className}"
            src="${src}"
            alt="${escapeHTML(bike.name)}"
            loading="lazy"
            onerror="this.onerror=null;this.src='assets/motorcycle-placeholder.svg'"
        >`;
    }

    // =========================================
    // KARTU MOTOR
    // =========================================

    function bikeCard(bike) {
        const stock = totalStock(bike);

        const badge = bike.badge
            ? `<span class="product-badge">${escapeHTML(bike.badge)}</span>`
            : '';

        const colors = (bike.colors || [])
            .slice(0, 4)
            .map(color =>
                `<span class="color-chip">${escapeHTML(color)}</span>`
            )
            .join('');

        return `<article class="product-card">
            <div class="product-image-wrap">
                ${imageHTML(bike, 'product-image')}
                ${badge}

                <span class="stock-tag ${stock <= 2 ? 'low-stock' : ''}">
                    ${stock > 0 ? `Stok ${stock} unit` : 'Stok habis'}
                </span>
            </div>

            <div class="product-info">
                <div class="product-meta">
                    <span>${escapeHTML(bike.brand || 'DriveMoto')}</span>
                    <span>${escapeHTML(bike.type || 'Motor')}</span>
                </div>

                <h3>${escapeHTML(bike.name)}</h3>

                <p class="product-desc">
                    ${escapeHTML(bike.description || 'Informasi motor tersedia di DriveMoto.')}
                </p>

                <div class="product-spec">
                    <span>◉ ${escapeHTML(bike.cc || '-')} cc</span>
                    <span>Warna: ${colors || 'Hubungi sales'}</span>
                </div>

                <div class="product-bottom">
                    <div>
                        <small>Mulai dari</small>
                        <strong>${rupiah(bike.price)}</strong>
                    </div>

                    <a
                        class="icon-button"
                        href="simulasi.html?bike=${encodeURIComponent(bike.id)}"
                        aria-label="Simulasi ${escapeHTML(bike.name)}"
                    >↗</a>
                </div>
            </div>
        </article>`;
    }

    function renderBikeGrid(target, bikes) {
        const el = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!el) return;

        el.innerHTML = bikes.length
            ? bikes.map(bikeCard).join('')
            : '<div class="empty-state">Motor tidak ditemukan. Coba ubah kata kunci atau filter pencarian.</div>';
    }

    // =========================================
    // PROMO
    // =========================================

    function renderPromos(target, promos = state.promos) {
        const el = typeof target === 'string'
            ? document.querySelector(target)
            : target;

        if (!el) return;

        el.innerHTML = promos.length
            ? promos.map((promo, index) =>
                `<article class="promo-card ${index % 2 ? 'promo-card-light' : ''}">
                    <div class="promo-mark">DM<span>+</span></div>

                    <div class="promo-copy">
                        <span class="eyebrow">PROGRAM DRIVEMOTO</span>
                        <h3>${escapeHTML(promo.title)}</h3>
                        <p>${escapeHTML(promo.description)}</p>
                        <small>${escapeHTML(promo.valid || 'Syarat dan ketentuan berlaku.')}</small>
                    </div>

                    <div class="promo-offer">
                        ${escapeHTML(promo.discount || 'Promo')}
                        <span>Untuk Anda</span>
                    </div>
                </article>`
            ).join('')
            : '<div class="empty-state">Belum ada promo aktif.</div>';
    }

    // =========================================
    // NAVBAR
    // =========================================

    function updateHeader() {
        const current = location.pathname.split('/').pop() || 'index.html';

        document.querySelectorAll('[data-nav]').forEach(link => {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === current
            );
        });

        const toggle = document.querySelector('.nav-toggle');
        const links = document.querySelector('.nav-links');

        if (toggle && links) {
            toggle.addEventListener('click', () => {
                links.classList.toggle('open');

                toggle.setAttribute(
                    'aria-expanded',
                    links.classList.contains('open') ? 'true' : 'false'
                );
            });
        }

        document.querySelectorAll('[data-year]').forEach(
            node => node.textContent = new Date().getFullYear()
        );
    }

    // =========================================
    // HALAMAN KATALOG
    // =========================================

    function bootCatalog() {
        const grid = document.querySelector('#catalogGrid');

        if (!grid) return;

        const search = document.querySelector('#catalogSearch');
        const type = document.querySelector('#catalogType');
        const sort = document.querySelector('#catalogSort');
        const count = document.querySelector('#catalogCount');

        const filter = () => {
            let bikes = [...state.bikes];

            const query = (search?.value || '').trim().toLowerCase();

            if (query) {
                bikes = bikes.filter(b =>
                    [b.name, b.brand, b.type, b.cc]
                        .join(' ')
                        .toLowerCase()
                        .includes(query)
                );
            }

            if (type?.value) {
                bikes = bikes.filter(b => b.type === type.value);
            }

            if (sort?.value === 'low') {
                bikes.sort((a, b) => a.price - b.price);
            }

            if (sort?.value === 'high') {
                bikes.sort((a, b) => b.price - a.price);
            }

            if (sort?.value === 'name') {
                bikes.sort((a, b) => a.name.localeCompare(b.name));
            }

            renderBikeGrid(grid, bikes);

            if (count) {
                count.textContent = `${bikes.length} motor ditemukan`;
            }
        };

        [search, type, sort].forEach(node =>
            node?.addEventListener(
                node === search ? 'input' : 'change',
                filter
            )
        );

        filter();
    }

    // =========================================
    // HALAMAN SIMULASI KREDIT
    // =========================================

    function bootFinance() {
        const select = document.querySelector('#financeBike');

        if (!select) return;

        select.innerHTML = state.bikes.map(b =>
            `<option value="${escapeHTML(b.id)}">${escapeHTML(b.name)} — ${rupiah(b.price)}</option>`
        ).join('');

        const params = new URLSearchParams(location.search);

        if (params.get('bike') && byId(params.get('bike'))) {
            select.value = params.get('bike');
        }

        const priceEl = document.querySelector('#financePrice');
        const dpRange = document.querySelector('#dpRange');
        const dpValue = document.querySelector('#dpValue');
        const tenor = document.querySelector('#financeTenor');
        const interest = document.querySelector('#financeInterest');
        const dpAmount = document.querySelector('#dpAmount');
        const monthly = document.querySelector('#monthlyAmount');
        const total = document.querySelector('#financeTotal');
        const summary = document.querySelector('#financeSummary');

        const calc = () => {
            const bike = byId(select.value) || state.bikes[0];

            if (!bike) return;

            const price = Number(bike.price) || 0;
            const pct = Number(dpRange.value) || 20;
            const down = Math.round(price * pct / 100);
            const principal = Math.max(0, price - down);
            const months = Number(tenor.value) || 36;
            const annual = (Number(interest.value) || 0) / 100;
            const totalInterest = principal * annual * (months / 12);

            const monthlyPay = months
                ? Math.ceil((principal + totalInterest) / months)
                : 0;

            if (priceEl) priceEl.textContent = rupiah(price);
            if (dpValue) dpValue.textContent = `${pct}%`;
            if (dpAmount) dpAmount.textContent = rupiah(down);
            if (monthly) monthly.textContent = rupiah(monthlyPay);
            if (total) total.textContent = rupiah(down + principal + totalInterest);

            if (summary) {
                summary.textContent =
                    `${bike.name} · ${months} bulan · bunga flat ${annual * 100}% per tahun`;
            }

            const hidden = document.querySelector('#financeLeadBike');

            if (hidden) {
                hidden.value = bike.name;
            }

            const hiddenPrice = document.querySelector('#financeLeadMonthly');

            if (hiddenPrice) {
                hiddenPrice.value = String(monthlyPay);
            }
        };

        [select, dpRange, tenor, interest].forEach(
            el => el.addEventListener('input', calc)
        );

        [select, tenor, interest].forEach(
            el => el.addEventListener('change', calc)
        );

        calc();

        document.querySelector('#financeLeadForm')?.addEventListener(
            'submit',
            event => {
                event.preventDefault();

                const form = new FormData(event.currentTarget);

                const lead = {
                    id: makeId('lead'),
                    type: 'Simulasi kredit',
                    name: form.get('name'),
                    phone: form.get('phone'),
                    bike: form.get('bike'),
                    monthly: Number(form.get('monthly')),
                    note: 'Permintaan tindak lanjut simulasi kredit',
                    date: new Date().toISOString(),
                    status: 'Baru'
                };

                state.leads.unshift(lead);
                saveState();

                event.currentTarget.reset();

                alert(
                    'Pengajuan simulasi berhasil dikirim. Tim DriveMoto akan menghubungi Anda.'
                );
            }
        );
    }

    // =========================================
    // HALAMAN TEST DRIVE
    // =========================================

    function bootTestDrive() {
        const select = document.querySelector('#testBike');

        if (!select) return;

        select.innerHTML = state.bikes.map(b =>
            `<option value="${escapeHTML(b.id)}">${escapeHTML(b.name)}</option>`
        ).join('');

        document.querySelector('#testDriveForm')?.addEventListener(
            'submit',
            event => {
                event.preventDefault();

                const form = new FormData(event.currentTarget);
                const bike = byId(form.get('bike'));

                if (!bike) {
                    return alert('Silakan pilih motor yang tersedia.');
                }

                if (totalStock(bike) < 1) {
                    return alert('Maaf, unit sedang tidak tersedia untuk test drive.');
                }

                const booking = {
                    id: makeId('booking'),
                    name: form.get('name'),
                    phone: form.get('phone'),
                    email: form.get('email'),
                    bike: bike.name,
                    bikeId: bike.id,
                    date: form.get('date'),
                    time: form.get('time'),
                    location: form.get('location'),
                    note: form.get('note'),
                    createdAt: new Date().toISOString(),
                    status: 'Menunggu konfirmasi'
                };

                state.bookings.unshift(booking);

                state.leads.unshift({
                    id: makeId('lead'),
                    type: 'Booking test drive',
                    name: booking.name,
                    phone: booking.phone,
                    bike: booking.bike,
                    date: booking.createdAt,
                    status: 'Baru'
                });

                saveState();
                event.currentTarget.reset();

                alert(
                    'Permintaan test drive berhasil dikirim. Admin akan mengonfirmasi jadwal Anda.'
                );
            }
        );

        const dateInput = document.querySelector('#testDate');

        if (dateInput) {
            dateInput.min = new Date().toISOString().slice(0, 10);
        }
    }

    // =========================================
    // HALAMAN BERANDA
    // =========================================

    function bootHome() {
        const featured = document.querySelector('#featuredBikes');

        if (featured) {
            renderBikeGrid(featured, state.bikes.slice(0, 3));
        }

        renderPromos('#homePromos');

        const stock = document.querySelector('#homeStock');

        if (stock) {
            stock.textContent = state.bikes.reduce(
                (sum, b) => sum + totalStock(b),
                0
            );
        }
    }

    // =========================================
    // HALAMAN PROMO
    // =========================================

    function bootPromo() {
        renderPromos('#promoGrid');
    }

    // =========================================
    // DASHBOARD ADMIN
    // =========================================

    function bootAdmin() {
        const loginPanel = document.querySelector('#adminLoginPanel');
        const dashboard = document.querySelector('#adminDashboard');

        if (!loginPanel || !dashboard) return;

        const showDashboard = () => {
            loginPanel.hidden = true;
            dashboard.hidden = false;
            renderAdmin();
        };

        if (isAdmin()) {
            showDashboard();
        }

        // LOGIN ADMIN
        document.querySelector('#adminLoginForm')?.addEventListener(
            'submit',
            event => {
                event.preventDefault();

                const form = event.currentTarget;
                const values = new FormData(form);

                const username = String(
                    values.get('username') || ''
                ).trim();

                const password = String(
                    values.get('password') || ''
                );

                const error = document.querySelector('#loginError');

                if (login(username, password)) {
                    if (error) error.textContent = '';

                    form.reset();
                    showDashboard();

                } else {
                    if (error) {
                        error.textContent =
                            'Username atau password tidak sesuai.';
                    }
                }
            }
        );

        document.querySelector('#adminLogout')?.addEventListener(
            'click',
            logout
        );

        // =====================================
        // PERBAIKAN EVENT STATUS BOOKING
        // =====================================

        // Event dipasang pada tabel booking.
        // Cara ini tetap bekerja walaupun isi tabel dirender ulang.

        document.querySelector('#bookingRows')?.addEventListener(
            'change',
            event => {
                const select = event.target.closest(
                    'select[data-booking-status]'
                );

                if (!select) return;

                updateBooking(
                    select.dataset.bookingId,
                    select.value
                );
            }
        );

        // MENU TAB ADMIN

        document.querySelectorAll('[data-admin-tab]').forEach(
            button => button.addEventListener('click', () => {
                document.querySelectorAll('[data-admin-tab]').forEach(
                    btn => btn.classList.toggle('selected', btn === button)
                );

                document.querySelectorAll('[data-admin-panel]').forEach(
                    panel => {
                        panel.hidden =
                            panel.dataset.adminPanel !== button.dataset.adminTab;
                    }
                );
            })
        );

        // =====================================
        // TAMBAH DAN EDIT MOTOR
        // =====================================

        document.querySelector('#bikeForm')?.addEventListener(
            'submit',
            async event => {
                event.preventDefault();

                if (!isAdmin()) {
                    return alert('Silakan login sebagai admin terlebih dahulu.');
                }

                const form = event.currentTarget;
                const data = new FormData(form);
                const editId = data.get('id');
                const existing = editId ? byId(editId) : null;
                const file = data.get('imageFile');

                let image = existing?.image ||
                    'assets/motorcycle-placeholder.svg';

                if (file && file.size) {
                    try {
                        image = await compressImage(file);

                    } catch (error) {
                        return alert(
                            'Foto gagal diproses. Gunakan file JPG, PNG, atau WebP.'
                        );
                    }
                }

                const bike = {
                    id: editId || makeId('bike'),
                    name: data.get('name').trim(),
                    brand: data.get('brand').trim(),
                    type: data.get('type'),
                    cc: data.get('cc').trim(),
                    price: Number(data.get('price')),
                    stock: Number(data.get('stock')),
                    colors: String(data.get('colors') || '')
                        .split(',')
                        .map(v => v.trim())
                        .filter(Boolean),
                    description: data.get('description').trim(),
                    image,
                    badge: data.get('badge').trim() || 'Unit pilihan'
                };

                if (existing) {
                    state.bikes = state.bikes.map(
                        item => item.id === editId ? bike : item
                    );

                } else {
                    state.bikes.unshift(bike);
                }

                if (saveState()) {
                    form.reset();

                    document.querySelector('#bikeId').value = '';
                    document.querySelector('#bikeFormTitle').textContent =
                        'Tambah motor baru';

                    document.querySelector('#cancelBikeEdit').hidden = true;

                    renderAdmin();

                    alert(
                        existing
                            ? 'Data motor berhasil diperbarui.'
                            : 'Motor baru berhasil ditambahkan ke katalog.'
                    );
                }
            }
        );

        document.querySelector('#cancelBikeEdit')?.addEventListener(
            'click',
            resetBikeForm
        );

        // =====================================
        // TAMBAH PROMO
        // =====================================

        document.querySelector('#promoForm')?.addEventListener(
            'submit',
            event => {
                event.preventDefault();

                if (!isAdmin()) {
                    return alert('Silakan login sebagai admin terlebih dahulu.');
                }

                const data = new FormData(event.currentTarget);

                state.promos.unshift({
                    id: makeId('promo'),
                    title: data.get('title'),
                    discount: data.get('discount'),
                    description: data.get('description'),
                    valid: data.get('valid')
                });

                saveState();
                event.currentTarget.reset();
                renderAdmin();

                alert('Promo berhasil ditambahkan.');
            }
        );
    }

    // =========================================
    // KOMPRES FOTO MOTOR
    // =========================================

    function compressImage(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                return reject(new Error('File bukan gambar'));
            }

            const reader = new FileReader();

            reader.onerror = reject;

            reader.onload = () => {
                const img = new Image();

                img.onerror = reject;

                img.onload = () => {
                    const maxWidth = 1000;
                    const scale = Math.min(1, maxWidth / img.width);

                    const canvas = document.createElement('canvas');

                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);

                    const ctx = canvas.getContext('2d');

                    ctx.drawImage(
                        img,
                        0,
                        0,
                        canvas.width,
                        canvas.height
                    );

                    resolve(canvas.toDataURL('image/jpeg', 0.76));
                };

                img.src = reader.result;
            };

            reader.readAsDataURL(file);
        });
    }

    // =========================================
    // RESET FORM MOTOR
    // =========================================

    function resetBikeForm() {
        const form = document.querySelector('#bikeForm');

        if (!form) return;

        form.reset();

        document.querySelector('#bikeId').value = '';
        document.querySelector('#bikeFormTitle').textContent =
            'Tambah motor baru';

        document.querySelector('#cancelBikeEdit').hidden = true;
    }

    // =========================================
    // EDIT MOTOR
    // =========================================

    function editBike(id) {
        if (!isAdmin()) {
            return alert('Silakan login sebagai admin terlebih dahulu.');
        }

        const bike = byId(id);

        if (!bike) return;

        document.querySelector('[data-admin-tab="inventory"]')?.click();

        const form = document.querySelector('#bikeForm');

        form.elements.id.value = bike.id;
        form.elements.name.value = bike.name || '';
        form.elements.brand.value = bike.brand || '';
        form.elements.type.value = bike.type || 'Matic';
        form.elements.cc.value = bike.cc || '';
        form.elements.price.value = bike.price || 0;
        form.elements.stock.value = totalStock(bike);
        form.elements.colors.value = (bike.colors || []).join(', ');
        form.elements.description.value = bike.description || '';
        form.elements.badge.value = bike.badge || '';

        document.querySelector('#bikeFormTitle').textContent =
            'Ubah data motor';

        document.querySelector('#cancelBikeEdit').hidden = false;

        form.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // =========================================
    // HAPUS MOTOR
    // =========================================

    function deleteBike(id) {
        if (!isAdmin()) {
            return alert('Silakan login sebagai admin terlebih dahulu.');
        }

        const bike = byId(id);

        if (!bike) return;

        if (!confirm(`Hapus ${bike.name} dari katalog?`)) {
            return;
        }

        state.bikes = state.bikes.filter(
            item => item.id !== id
        );

        saveState();
        renderAdmin();
    }

    // =========================================
    // PERBAIKAN UTAMA UPDATE BOOKING
    // =========================================

    function updateBooking(id, status) {

        // Memastikan admin sudah login
        if (!isAdmin()) {
            alert('Sesi admin sudah berakhir. Silakan login kembali.');
            return;
        }

        // Status yang diperbolehkan
        const allowedStatuses = [
            'Menunggu konfirmasi',
            'Disetujui',
            'Selesai',
            'Ditolak'
        ];

        if (!allowedStatuses.includes(status)) {
            alert('Status booking tidak valid.');
            renderAdmin();
            return;
        }

        // Mengambil data terbaru dari localStorage
        state = readState();

        // Mencari booking berdasarkan ID
        const bookingIndex = state.bookings.findIndex(
            item => String(item.id) === String(id)
        );

        // Jika booking tidak ditemukan
        if (bookingIndex === -1) {
            alert('Data booking tidak ditemukan. Muat ulang halaman admin.');
            renderAdmin();
            return;
        }

        // Menyimpan status sebelumnya
        const previousBooking = {
            ...state.bookings[bookingIndex]
        };

        // Mengubah status booking
        state.bookings[bookingIndex] = {
            ...previousBooking,
            status: status,
            updatedAt: new Date().toISOString()
        };

        // Menyimpan perubahan
        if (saveState()) {

            // Memperbarui tampilan dashboard
            renderAdmin();

            alert(
                `Status booking berhasil diubah menjadi: ${status}`
            );

        } else {

            // Mengembalikan status sebelumnya jika gagal disimpan
            state.bookings[bookingIndex] = previousBooking;

            renderAdmin();
        }
    }

    // =========================================
    // UPDATE DATA PELANGGAN
    // =========================================

    function updateLead(id, status) {
        if (!isAdmin()) return;

        state.leads = state.leads.map(
            item => String(item.id) === String(id)
                ? { ...item, status }
                : item
        );

        saveState();
        renderAdmin();
    }

    // =========================================
    // HAPUS PROMO
    // =========================================

    function deletePromo(id) {
        if (!isAdmin() || !confirm('Hapus promo ini?')) {
            return;
        }

        state.promos = state.promos.filter(
            item => item.id !== id
        );

        saveState();
        renderAdmin();
    }

    // =========================================
    // TAMPILAN DASHBOARD ADMIN
    // =========================================

    function renderAdmin() {

        // TABEL MOTOR
        const bikesEl = document.querySelector('#adminBikeRows');

        if (bikesEl) {
            bikesEl.innerHTML = state.bikes.map(b =>
                `<tr>
                    <td>
                        <div class="table-product">
                            ${imageHTML(b, 'table-thumb')}

                            <div>
                                <strong>${escapeHTML(b.name)}</strong>

                                <small>
                                    ${escapeHTML(b.brand || '')} · ${escapeHTML(b.type || '')}
                                </small>
                            </div>
                        </div>
                    </td>

                    <td>${escapeHTML(b.cc || '-')} cc</td>

                    <td>${rupiah(b.price)}</td>

                    <td>
                        <span class="table-stock">
                            ${totalStock(b)} unit
                        </span>
                    </td>

                    <td>
                        <div class="table-actions">
                            <button
                                class="mini-action"
                                onclick="DM.editBike('${escapeHTML(b.id)}')"
                            >Edit</button>

                            <button
                                class="mini-action danger"
                                onclick="DM.deleteBike('${escapeHTML(b.id)}')"
                            >Hapus</button>
                        </div>
                    </td>
                </tr>`
            ).join('') || '<tr><td colspan="5">Belum ada data motor.</td></tr>';
        }

        // =====================================
        // TABEL BOOKING TEST DRIVE
        // =====================================

        const bookingEl = document.querySelector('#bookingRows');

        if (bookingEl) {
            bookingEl.innerHTML = state.bookings.map(b =>
                `<tr>
                    <td>
                        <strong>${escapeHTML(b.name)}</strong>
                        <small>${escapeHTML(b.phone)}</small>
                    </td>

                    <td>${escapeHTML(b.bike)}</td>

                    <td>
                        ${escapeHTML(b.date)}
                        <small>${escapeHTML(b.time)}</small>
                    </td>

                    <td>${escapeHTML(b.location)}</td>

                    <td>
                        <select
                            class="status-select"
                            data-booking-status
                            data-booking-id="${escapeHTML(b.id)}"
                            aria-label="Ubah status booking ${escapeHTML(b.name)}"
                        >
                            ${[
                                'Menunggu konfirmasi',
                                'Disetujui',
                                'Selesai',
                                'Ditolak'
                            ].map(s =>
                                `<option
                                    value="${s}"
                                    ${b.status === s ? 'selected' : ''}
                                >${s}</option>`
                            ).join('')}
                        </select>
                    </td>
                </tr>`
            ).join('') || '<tr><td colspan="5">Belum ada permintaan test drive.</td></tr>';
        }

        // =====================================
        // TABEL DATA PELANGGAN
        // =====================================

        const leadEl = document.querySelector('#leadRows');

        if (leadEl) {
            leadEl.innerHTML = state.leads.map(l =>
                `<tr>
                    <td>
                        <strong>${escapeHTML(l.name)}</strong>
                        <small>${escapeHTML(l.phone)}</small>
                    </td>

                    <td>${escapeHTML(l.type)}</td>

                    <td>${escapeHTML(l.bike || '-')}</td>

                    <td>${l.monthly ? rupiah(l.monthly) : '—'}</td>

                    <td>
                        <select
                            class="status-select"
                            onchange="DM.updateLead('${escapeHTML(l.id)}',this.value)"
                        >
                            ${['Baru', 'Dihubungi', 'Selesai']
                                .map(s =>
                                    `<option value="${s}" ${l.status === s ? 'selected' : ''}>${s}</option>`
                                ).join('')}
                        </select>
                    </td>
                </tr>`
            ).join('') || '<tr><td colspan="5">Belum ada data pelanggan.</td></tr>';
        }

        // =====================================
        // TAMPILAN PROMO ADMIN
        // =====================================

        const promoEl = document.querySelector('#adminPromoRows');

        if (promoEl) {
            promoEl.innerHTML = state.promos.map(p =>
                `<div class="admin-promo-row">
                    <div>
                        <strong>${escapeHTML(p.title)}</strong>

                        <small>
                            ${escapeHTML(p.discount)} · ${escapeHTML(p.description)}
                        </small>
                    </div>

                    <button
                        class="mini-action danger"
                        onclick="DM.deletePromo('${escapeHTML(p.id)}')"
                    >Hapus</button>
                </div>`
            ).join('') || '<p class="muted">Belum ada promo.</p>';
        }

        // =====================================
        // STATISTIK DASHBOARD
        // =====================================

        const counts = {
            bikes: state.bikes.length,

            stock: state.bikes.reduce(
                (sum, b) => sum + totalStock(b),
                0
            ),

            bookings: state.bookings.length,

            leads: state.leads.length
        };

        Object.entries(counts).forEach(([key, value]) => {
            document.querySelectorAll(`[data-stat="${key}"]`).forEach(
                el => {
                    el.textContent = value;
                }
            );
        });
    }

    // =========================================
    // MENJALANKAN SELURUH HALAMAN
    // =========================================

    document.addEventListener('DOMContentLoaded', () => {

        updateHeader();

        bootHome();

        bootCatalog();

        bootFinance();

        bootTestDrive();

        bootPromo();

        bootAdmin();

    });

    // =========================================
    // FUNGSI GLOBAL DRIVEMOTO
    // =========================================

    window.DM = {
        isAdmin,
        logout,
        editBike,
        deleteBike,
        updateBooking,
        updateLead,
        deletePromo,
        rupiah
    };

})();