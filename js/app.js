/* ============================================
   ANKARA BAROSU MOBİL UYGULAMA
   Güçlü Baro · Güçlü Avukat
   Proje Geliştirme Ekibi:
   Av. Hayri Efe SAVRAN
   Av. Mehmet TÜRKMEN
   Av. Gülçin KELEŞ
   ============================================ */

// ==================== APP STATE ====================
const state = {
    currentPage: 'home',
    currentTab: 'home',
    history: [],
    cart: [],
    cartCount: 0
};

const tabPages = ['home', 'hizmetler', 'acil', 'avantajlar', 'profil'];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // Set today's date
    const today = new Date();
    const options = { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' };
    const dateStr = today.toLocaleDateString('tr-TR', options);
    const el = document.getElementById('today-date');
    if (el) el.textContent = dateStr;
    const bel = document.getElementById('bulletin-date');
    if (bel) bel.textContent = dateStr;

    // Show app after splash
    setTimeout(() => {
        const splash = document.getElementById('splash-screen');
        if (splash) splash.style.display = 'none';
        const app = document.getElementById('app');
        if (app) app.style.display = '';
    }, 2800);

    // Register service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(() => {});
    }
}

// ==================== NAVIGATION ====================
function navigateTo(pageId) {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        state.history.push(currentPage.id.replace('page-', ''));
        currentPage.classList.remove('active');
    }

    const newPage = document.getElementById('page-' + pageId);
    if (newPage) {
        newPage.classList.remove('tab-page');
        newPage.classList.add('active');
        newPage.querySelector('.page-content')?.scrollTo(0, 0);
        state.currentPage = pageId;
    }

    // Update bottom nav if it's a tab page
    if (tabPages.includes(pageId)) {
        updateBottomNav(pageId);
    }
}

function goBack() {
    const currentPage = document.querySelector('.page.active');
    if (currentPage) {
        currentPage.classList.remove('active');
    }

    const prevPageId = state.history.pop() || 'home';
    const prevPage = document.getElementById('page-' + prevPageId);
    if (prevPage) {
        prevPage.classList.add('active');
        if (tabPages.includes(prevPageId)) {
            prevPage.classList.add('tab-page');
        }
        state.currentPage = prevPageId;
    }

    if (tabPages.includes(prevPageId)) {
        updateBottomNav(prevPageId);
    }
}

function switchTab(tabId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.remove('active', 'tab-page');
    });

    // Show target tab page
    const page = document.getElementById('page-' + tabId);
    if (page) {
        page.classList.add('active', 'tab-page');
        page.querySelector('.page-content')?.scrollTo(0, 0);
    }

    state.currentPage = tabId;
    state.currentTab = tabId;
    state.history = [];
    updateBottomNav(tabId);
}

function updateBottomNav(activeTab) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.tab === activeTab);
    });
}

// ==================== NOTIFICATIONS ====================
function showNotifications() {
    navigateTo('bildirimler');
}

// ==================== COURTHOUSE TOGGLE ====================
function toggleCourthouse(card) {
    const detail = card.querySelector('.courthouse-detail');
    const isOpen = card.classList.contains('open');

    // Close all
    document.querySelectorAll('.courthouse-card').forEach(c => {
        c.classList.remove('open');
        const d = c.querySelector('.courthouse-detail');
        if (d) d.style.display = 'none';
    });

    if (!isOpen) {
        card.classList.add('open');
        if (detail) detail.style.display = 'block';
    }
}

// ==================== SEARCH ====================
function searchDirectory(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.courthouse-card').forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(q) || q === '' ? '' : 'none';
    });
}

// ==================== CATEGORY SELECT ====================
function selectCategory(chip) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active-chip'));
    chip.classList.add('active-chip');
}

// ==================== FILTER FUNCTIONS ====================
function filterBulletin(tab, type) {
    tab.parentElement.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.bulletin-item').forEach(item => {
        if (type === 'all' || item.dataset.type === type) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

function filterEvents(tab, type) {
    tab.parentElement.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.event-card').forEach(card => {
        if (type === 'all' || card.dataset.type === type) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

function filterMarket(tab, type) {
    tab.parentElement.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    document.querySelectorAll('.market-item').forEach(item => {
        if (type === 'all' || item.dataset.category === type) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ==================== SOS ====================
function selectSOSType(btn) {
    document.querySelectorAll('.sos-type').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function activateSOS() {
    const selectedType = document.querySelector('.sos-type.selected');

    const overlay = document.createElement('div');
    overlay.className = 'sos-active-overlay';
    overlay.innerHTML = `
        <div class="sos-spinner"></div>
        <h2>ACİL DESTEK ÇAĞRISI</h2>
        <p>Ankara Barosu bilgilendiriliyor...</p>
        <p style="font-size:13px;opacity:0.7;margin-bottom:8px;">Olay Türü: ${selectedType ? selectedType.dataset.type : 'Belirtilmedi'}</p>
        <p style="font-size:13px;opacity:0.7;margin-bottom:24px;">Baro Başkanı Av. Mustafa KÖROĞLU ve<br>Avukat Hakları Merkezi haberdar ediliyor</p>
        <button class="sos-cancel" onclick="cancelSOS(this)">İptal Et</button>
    `;
    document.body.appendChild(overlay);

    // Get location if enabled
    const shareLocation = document.getElementById('shareLocation');
    if (shareLocation && shareLocation.checked && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                // Location obtained
            },
            () => {
                // Location denied
            }
        );
    }

    // Simulate sending after 3 seconds
    setTimeout(() => {
        if (document.body.contains(overlay)) {
            overlay.querySelector('h2').textContent = 'ÇAĞRI GÖNDERİLDİ';
            overlay.querySelector('.sos-spinner').style.display = 'none';
            overlay.querySelector('p').textContent = 'Avukat Hakları Merkezi bilgilendirildi.';
            const cancelBtn = overlay.querySelector('.sos-cancel');
            if (cancelBtn) cancelBtn.textContent = 'Kapat';
        }
    }, 3000);
}

function cancelSOS(btn) {
    const overlay = btn.closest('.sos-active-overlay');
    if (overlay) {
        overlay.style.animation = 'none';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity 0.3s ease';
        setTimeout(() => overlay.remove(), 300);
    }
}

// ==================== MODALS ====================
function showModal(modalId) {
    const modal = document.getElementById('app-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');

    let modalTitle = '';
    let modalBody = '';

    switch (modalId) {
        case 'mentor-modal':
            modalTitle = 'Mentor Eşleştirme';
            modalBody = `
                <div class="info-note mb-16">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <p>Deneyimli meslektaşlarla eşleşerek karmaşık dosyalarınızda rehberlik alabilirsiniz. Gönüllülük esasına dayalıdır.</p>
                </div>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
                    İlk defa görülen bir dava türü, karmaşık bir dosya veya yüksek riskli bir iş karşısında tecrübe eksikliği söz konusu olduğunda avukat dayanışma hattına başvurabilirsiniz.<br><br>
                    Havuz sisteminden alanında deneyimli bir avukatla eşleşmeniz sağlanır. Kıdemli avukatın mentorluğunda işi öğrenmeniz temel alınır.<br><br>
                    <strong style="color: var(--gold);">Sorumluluk her zaman asıl avukata ait kalır.</strong><br><br>
                    <em>Bu proje Baro Başkanı Av. Mustafa KÖROĞLU'nun vizyonu doğrultusunda hayata geçirilmiştir.</em>
                </p>
            `;
            break;

        case 'psikolojik-modal':
            modalTitle = 'Psikolojik Destek';
            modalBody = `
                <div class="info-note mb-16">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                    <p>Gönüllülük ve gizlilik esasına dayalı profesyonel psikolojik destek hizmeti.</p>
                </div>
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
                    Ankara Barosu, avukatlara meslek kaynaklı stres, tükenmişlik ve benzeri sorunlar karşısında psikolojik destek imkânı sunmaktadır.<br><br>
                    Bu hizmet, Baronun yalnızca mesleki ve kurumsal değil, aynı zamanda manevi anlamda da avukatının yanında olduğunu ortaya koymaktadır.<br><br>
                    <strong style="color: var(--text-primary);">Hizmet tamamen gizlilik esasına dayalıdır.</strong><br><br>
                    <em style="color: var(--gold);">Güçlü Baro, Güçlü Avukat - Av. Mustafa KÖROĞLU</em>
                </p>
            `;
            break;

        case 'hukuki-modal':
            modalTitle = 'Hukuki Danışma';
            modalBody = `
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
                    Karmaşık dosyalarınızda uzman meslektaşlardan hukuki görüş ve destek alabilirsiniz.<br><br>
                    Bu sistem, hukuki deneyimi fazla olan meslektaşların bilgi ve tecrübelerinden yararlanmanızı sağlar.<br><br>
                    Başvurunuz havuz sistemine düşer ve ilgili alanda uzman bir avukatla eşleştirilirsiniz.
                </p>
            `;
            break;

        case 'acil-destek-modal':
            modalTitle = 'Acil Mesleki Destek';
            modalBody = `
                <p style="color: var(--text-secondary); font-size: 13px; line-height: 1.6;">
                    Yüksek riskli durumlarda anlık müdahale mekanizması devreye girer.<br><br>
                    Avukat Hakları Merkezi, Baro Başkanlığı ve Nöbetçi Yönetim Kurulu Üyesi sırasıyla bilgilendirilir.<br><br>
                    <strong style="color: var(--red);">Acil durumlar için ana sayfadaki Acil Destek butonunu kullanın.</strong>
                </p>
            `;
            break;

        case 'basvuru-modal':
            modalTitle = 'Etkinlik Başvurusu';
            modalBody = `
                <div class="form-group">
                    <label>Ad Soyad</label>
                    <input type="text" class="form-input" placeholder="Adınız ve soyadınız">
                </div>
                <div class="form-group">
                    <label>Sicil Numarası</label>
                    <input type="text" class="form-input" placeholder="Baro sicil numaranız">
                </div>
                <div class="form-group">
                    <label>Telefon</label>
                    <input type="tel" class="form-input" placeholder="05XX XXX XX XX">
                </div>
                <div class="form-group">
                    <label>E-posta</label>
                    <input type="email" class="form-input" placeholder="E-posta adresiniz">
                </div>
                <button class="btn-primary mt-16" onclick="submitForm('etkinlik')">Başvuru Gönder</button>
            `;
            break;

        case 'feedback-modal':
            modalTitle = 'Meslektaş Geri Bildirim';
            modalBody = `
                <p style="color: var(--text-secondary); font-size: 13px; margin-bottom: 16px;">Anlaşmalı kurumlarla ilgili deneyimlerinizi paylaşarak hizmet kalitesinin ölçülmesine katkıda bulunun.</p>
                <div class="form-group">
                    <label>Kurum</label>
                    <select class="form-select">
                        <option>Kurum seçiniz...</option>
                        <option>Teknosa</option>
                        <option>Migros</option>
                        <option>D&R</option>
                        <option>BP</option>
                        <option>Acıbadem Sağlık</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Değerlendirme</label>
                    <div style="display:flex;gap:8px;margin-top:4px;">
                        <span style="font-size:28px;cursor:pointer;" onclick="this.parentElement.dataset.rating='1'">&#9733;</span>
                        <span style="font-size:28px;cursor:pointer;" onclick="this.parentElement.dataset.rating='2'">&#9733;</span>
                        <span style="font-size:28px;cursor:pointer;" onclick="this.parentElement.dataset.rating='3'">&#9733;</span>
                        <span style="font-size:28px;cursor:pointer;" onclick="this.parentElement.dataset.rating='4'">&#9733;</span>
                        <span style="font-size:28px;cursor:pointer;" onclick="this.parentElement.dataset.rating='5'">&#9733;</span>
                    </div>
                </div>
                <div class="form-group">
                    <label>Yorumunuz</label>
                    <textarea class="form-textarea" rows="3" placeholder="Deneyiminizi paylaşın..."></textarea>
                </div>
                <button class="btn-primary mt-8" onclick="submitForm('feedback')">Gönder</button>
            `;
            break;

        case 'cart-modal':
            modalTitle = 'Sepetim';
            if (state.cart.length === 0) {
                modalBody = '<p style="text-align:center;color:var(--text-muted);padding:32px 0;">Sepetiniz boş.</p>';
            } else {
                let total = 0;
                let items = '';
                state.cart.forEach((item, i) => {
                    total += item.price;
                    items += `
                        <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border);">
                            <span style="color:var(--text-primary);font-size:14px;">${item.name}</span>
                            <div style="display:flex;align-items:center;gap:12px;">
                                <span style="color:var(--gold);font-weight:600;">₺${item.price.toLocaleString('tr-TR')}</span>
                                <button onclick="removeFromCart(${i})" style="background:none;border:none;color:var(--red);cursor:pointer;font-size:18px;">×</button>
                            </div>
                        </div>
                    `;
                });
                modalBody = `
                    ${items}
                    <div style="display:flex;justify-content:space-between;padding:16px 0;margin-top:8px;">
                        <span style="font-size:16px;font-weight:600;color:var(--text-primary);">Toplam</span>
                        <span style="font-size:18px;font-weight:700;color:var(--gold);">₺${total.toLocaleString('tr-TR')}</span>
                    </div>
                    <button class="btn-primary" onclick="submitForm('cart')">Siparişi Tamamla</button>
                `;
            }
            break;

        case 'islem-modal':
            modalTitle = 'Dijital İşlemler';
            modalBody = `
                <div class="service-cards">
                    <div class="service-card">
                        <div class="service-card-icon sc-blue"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
                        <div class="service-card-content"><h4>Aidat Ödeme</h4><p>Online aidat ödeme işlemleri</p></div>
                    </div>
                    <div class="service-card">
                        <div class="service-card-icon sc-green"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                        <div class="service-card-content"><h4>Belge Talebi</h4><p>Faaliyet belgesi, bonservis vb.</p></div>
                    </div>
                    <div class="service-card">
                        <div class="service-card-icon sc-purple"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg></div>
                        <div class="service-card-content"><h4>Ruhsat İşlemleri</h4><p>Ruhsat yenileme ve başvuru</p></div>
                    </div>
                    <div class="service-card">
                        <div class="service-card-icon sc-red"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></div>
                        <div class="service-card-content"><h4>Tevkil İşlemleri</h4><p>Tevkil verme ve takip</p></div>
                    </div>
                </div>
            `;
            break;

        case 'basvuru-gecmis-modal':
            modalTitle = 'Başvuru Geçmişi';
            modalBody = `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;font-weight:600;color:var(--gold);">AB-2026-00142</span>
                            <span style="font-size:10px;padding:3px 8px;background:rgba(46,204,113,0.15);color:var(--green);border-radius:4px;font-weight:600;">İşlemde</span>
                        </div>
                        <h4 style="font-size:14px;color:var(--text-primary);margin-top:6px;">CMK Görevlendirme Talebi</h4>
                        <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">05.04.2026</p>
                    </div>
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;font-weight:600;color:var(--gold);">AB-2026-00098</span>
                            <span style="font-size:10px;padding:3px 8px;background:rgba(52,152,219,0.15);color:var(--blue);border-radius:4px;font-weight:600;">Tamamlandı</span>
                        </div>
                        <h4 style="font-size:14px;color:var(--text-primary);margin-top:6px;">Faaliyet Belgesi Talebi</h4>
                        <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">28.03.2026</p>
                    </div>
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;font-weight:600;color:var(--gold);">AB-2026-00065</span>
                            <span style="font-size:10px;padding:3px 8px;background:rgba(52,152,219,0.15);color:var(--blue);border-radius:4px;font-weight:600;">Tamamlandı</span>
                        </div>
                        <h4 style="font-size:14px;color:var(--text-primary);margin-top:6px;">Eğitim Kaydı</h4>
                        <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">15.03.2026</p>
                    </div>
                </div>
            `;
            break;

        case 'aidat-modal':
            modalTitle = 'Aidat Bilgisi';
            modalBody = `
                <div style="text-align:center;padding:16px 0;">
                    <div style="width:80px;height:80px;border-radius:50%;background:rgba(46,204,113,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 12px;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--green)" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h3 style="color:var(--green);font-size:16px;">Aidat Durumu: Güncel</h3>
                    <p style="color:var(--text-secondary);font-size:13px;margin-top:8px;">2026 yılı aidatınız ödenmiştir.</p>
                </div>
                <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);margin-top:12px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:var(--text-secondary);font-size:13px;">Yıllık Aidat</span>
                        <span style="color:var(--text-primary);font-size:13px;font-weight:600;">₺4.500</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                        <span style="color:var(--text-secondary);font-size:13px;">Ödenen</span>
                        <span style="color:var(--green);font-size:13px;font-weight:600;">₺4.500</span>
                    </div>
                    <div style="display:flex;justify-content:space-between;">
                        <span style="color:var(--text-secondary);font-size:13px;">Kalan</span>
                        <span style="color:var(--text-primary);font-size:13px;font-weight:600;">₺0</span>
                    </div>
                </div>
                <p style="color:var(--text-muted);font-size:11px;text-align:center;margin-top:16px;">
                    Aidatınız Ankara Barosu hizmetlerine dönüştürülmektedir.<br>
                    <em style="color:var(--gold);">Güçlü Baro · Güçlü Avukat</em>
                </p>
            `;
            break;

        case 'egitim-modal':
            modalTitle = 'Eğitim Kayıtları';
            modalBody = `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <h4 style="font-size:14px;color:var(--text-primary);">Ticaret Hukuku Güncel Gelişmeler</h4>
                        <p style="font-size:12px;color:var(--text-secondary);margin-top:4px;">20 Mart 2026 · 3 Saat · Sertifikalı</p>
                        <span style="display:inline-block;font-size:10px;padding:3px 8px;background:rgba(46,204,113,0.15);color:var(--green);border-radius:4px;font-weight:600;margin-top:6px;">Tamamlandı</span>
                    </div>
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <h4 style="font-size:14px;color:var(--text-primary);">CMK Uygulamaları Eğitimi</h4>
                        <p style="font-size:12px;color:var(--text-secondary);margin-top:4px;">5 Şubat 2026 · 4 Saat · Sertifikalı</p>
                        <span style="display:inline-block;font-size:10px;padding:3px 8px;background:rgba(46,204,113,0.15);color:var(--green);border-radius:4px;font-weight:600;margin-top:6px;">Tamamlandı</span>
                    </div>
                </div>
            `;
            break;

        case 'cmk-modal':
            modalTitle = 'CMK / Adli Yardım';
            modalBody = `
                <div style="display:flex;flex-direction:column;gap:8px;">
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;font-weight:600;color:var(--gold);">CMK-2026/0412</span>
                            <span style="display:inline-block;font-size:10px;padding:3px 8px;background:rgba(230,126,34,0.15);color:var(--orange);border-radius:4px;font-weight:600;">Beklemede</span>
                        </div>
                        <h4 style="font-size:14px;color:var(--text-primary);margin-top:6px;">Ankara 5. Ağır Ceza</h4>
                        <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">Görevlendirme Tarihi: 08.04.2026</p>
                    </div>
                    <div style="padding:14px;background:var(--surface);border-radius:var(--radius-md);border:1px solid var(--border);">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:12px;font-weight:600;color:var(--gold);">AY-2026/0389</span>
                            <span style="display:inline-block;font-size:10px;padding:3px 8px;background:rgba(46,204,113,0.15);color:var(--green);border-radius:4px;font-weight:600;">Tamamlandı</span>
                        </div>
                        <h4 style="font-size:14px;color:var(--text-primary);margin-top:6px;">Adli Yardım - Boşanma Davası</h4>
                        <p style="font-size:12px;color:var(--text-muted);margin-top:4px;">01.03.2026</p>
                    </div>
                </div>
            `;
            break;

        default:
            modalTitle = 'Bilgi';
            modalBody = '<p style="color:var(--text-secondary);">Bu özellik yakında aktif olacaktır.</p>';
    }

    title.textContent = modalTitle;
    body.innerHTML = modalBody;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ==================== CART ====================
function addToCart(name, price) {
    state.cart.push({ name, price });
    state.cartCount = state.cart.length;
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = state.cartCount;
    showToast(name + ' sepete eklendi');
}

function removeFromCart(index) {
    state.cart.splice(index, 1);
    state.cartCount = state.cart.length;
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = state.cartCount;
    // Refresh modal
    showModal('cart-modal');
}

// ==================== FORM SUBMISSIONS ====================
function submitForm(type) {
    let message = '';
    switch (type) {
        case 'dayanisma':
            message = 'Destek talebiniz alınmıştır. En kısa sürede dönüş yapılacaktır.';
            break;
        case 'basvuru':
            message = 'Başvurunuz kaydedildi. Takip numaranız: AB-2026-' + Math.floor(10000 + Math.random() * 90000);
            break;
        case 'etkinlik':
            message = 'Etkinlik başvurunuz alınmıştır.';
            closeModal();
            break;
        case 'feedback':
            message = 'Geri bildiriminiz için teşekkürler!';
            closeModal();
            break;
        case 'cart':
            message = 'Siparişiniz alınmıştır. Teşekkürler!';
            state.cart = [];
            state.cartCount = 0;
            const badge = document.getElementById('cart-count');
            if (badge) badge.textContent = '0';
            closeModal();
            break;
        default:
            message = 'İşleminiz başarıyla gerçekleştirildi.';
    }
    showToast(message);
}

function trackApplication() {
    showToast('Başvuru sorgulanıyor...');
    setTimeout(() => {
        showModal('basvuru-gecmis-modal');
    }, 800);
}

function subscribeBulletin() {
    showToast('Bülten aboneliğiniz aktif edildi!');
}

function showAdvantageCategory(cat) {
    showToast('Kategori: ' + cat.charAt(0).toUpperCase() + cat.slice(1));
}

// ==================== TOAST ====================
function showToast(message) {
    const toast = document.getElementById('success-toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = message;
        toast.style.display = 'flex';
        toast.style.animation = 'none';
        void toast.offsetWidth;
        toast.style.animation = 'toastIn 0.3s ease';

        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }
}

// ==================== PWA INSTALL ====================
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

// ==================== PREVENT OVERSCROLL ====================
document.body.addEventListener('touchmove', (e) => {
    // Allow scrolling within page-content
    if (!e.target.closest('.page-content') && !e.target.closest('.modal-content')) {
        e.preventDefault();
    }
}, { passive: false });
