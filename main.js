// 粒子背景效果
class ParticleBackground {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 50;
        
        document.querySelector('.particles-bg').appendChild(this.canvas);
        this.init();
        this.animate();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.createParticles();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 3 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(45, 93, 123, 0.3)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// 3D地球仪效果
class Globe {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.globe = null;
        
        this.init();
    }

    init() {
        const container = document.querySelector('.globe-container');
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(this.renderer.domElement);

        this.camera.position.z = 5;

        // 创建地球
        const geometry = new THREE.SphereGeometry(2, 32, 32);
        const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            specular: new THREE.Color(0x333333),
            shininess: 5
        });
        this.globe = new THREE.Mesh(geometry, material);
        this.scene.add(this.globe);

        // 添加环境光和平行光
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);

        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.globe.rotation.y += 0.005;
        this.renderer.render(this.scene, this.camera);
    }
}

// AI对话模块
class ChatWidget {
    constructor() {
        this.container = document.querySelector('.chat-container');
        this.toggleBtn = document.querySelector('.chat-toggle');
        this.closeBtn = document.querySelector('.close-chat');
        this.sendBtn = document.querySelector('.send-btn');
        this.textarea = document.querySelector('.chat-input textarea');
        this.messagesContainer = document.querySelector('.chat-messages');

        // 预设问答内容
        this.qaData = {
            '景点': '爱尔兰以其壮丽的自然风光闻名，以下是一些必去的自然景点：\n1. 莫赫悬崖（Cliffs of Moher）：位于西海岸，是欧洲最高的海崖之一\n2. 基拉尼国家公园（Killarney National Park）：拥有湖泊、山脉和森林\n3. 康尼马拉国家公园（Connemara National Park）：以其荒野景观和十二峰山脉著称\n4. 巨人堤道（Giant\'s Causeway）：位于北爱尔兰，由数万根玄武岩柱组成\n5. 丁格尔半岛（Dingle Peninsula）：以其迷人的海岸线和斯莱角闻名\n\n小贴士：这些景点大多适合自驾游览，建议提前查看天气和开放时间。',
            '交通': '从都柏林到莫赫悬崖的交通方式主要有以下几种：\n1. 自驾：最灵活的方式，约需3.5小时\n2. 巴士：多家巴士公司提供直达或转车服务，车程约4.5-5小时\n3. 旅行团：包含交通和导游服务，适合不想自驾的游客\n4. 火车+巴士：可先乘坐火车到戈尔韦或恩尼斯，再转乘巴士\n\n建议：自驾是最受欢迎的选择，但如果不熟悉路况，可以选择旅行团或公共交通。',
            '天气': '爱尔兰的天气以多变著称，夏季（6月至8月）气温通常在15°C至20°C之间。以下是夏季旅游的衣物建议：\n1. 防水外套：必备，以应对突如其来的降雨\n2. 保暖衣物：早晚温差较大，建议带轻便毛衣或夹克\n3. 舒适鞋子：适合徒步的防水鞋或运动鞋\n4. 帽子与围巾：防风防雨，尤其是在海岸地区\n5. 雨伞：轻便折叠伞，方便随身携带\n\n小贴士：爱尔兰的天气变化快，建议随时查看天气预报并做好多层穿衣的准备。',
            '美食': '爱尔兰的美食以传统和新鲜食材为主，以下是几种特色美食：\n1. 爱尔兰炖菜（Irish Stew）：用羊肉、土豆、胡萝卜和洋葱炖制\n2. 苏打面包（Soda Bread）：传统的无酵母面包，口感松软\n3. 海鲜：爱尔兰的海鲜非常新鲜，尤其是牡蛎、三文鱼和鳕鱼\n4. 黑布丁（Black Pudding）：用猪血和燕麦制成的香肠\n5. 吉尼斯啤酒炖牛肉：用爱尔兰著名的吉尼斯啤酒炖制的牛肉\n\n推荐体验：在都柏林的Temple Bar区或高威的Quay Street，可以找到许多提供传统美食的餐厅。',
            '签证': '爱尔兰的签证要求取决于您的国籍和旅行目的：\n1. 免签国家：欧盟/欧洲经济区国家、美国、加拿大、澳大利亚、新西兰等可免签停留90天\n2. 需要签证：中国、印度、南非等国家需要提前申请短期旅游签证\n3. 签证申请：可通过爱尔兰移民局官网在线申请\n4. 英国签证：持有英国"C类短期签证"的中国公民可免签进入爱尔兰，但需从英国入境\n\n建议：提前查看爱尔兰移民局官网（www.irishimmigration.ie）获取最新签证信息。',
            '联系': '您可以通过以下方式联系我们：\n1. 微信：Jimslee614525192\n2. 小红书：爱尔兰潮汕人\n3. 抖音：乌克兰潮汕人\n\n欢迎随时与我们联系，我们将为您提供专业的爱尔兰旅游咨询服务。'
        };

        this.init();
    }

    init() {
        this.toggleBtn.addEventListener('click', () => this.toggleChat());
        this.closeBtn.addEventListener('click', () => this.toggleChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.textarea.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // 添加欢迎消息
        this.addMessage('你好！我是爱尔兰旅游顾问，很高兴为您服务。您可以询问我关于爱尔兰的景点、交通、天气、美食、签证等问题，或者询问如何联系我们。', 'ai');
    }

    toggleChat() {
        this.container.classList.toggle('active');
    }

    sendMessage() {
        const message = this.textarea.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.textarea.value = '';

        // 根据关键词匹配回复
        setTimeout(() => {
            let response = '抱歉，我可能没有完全理解您的问题。您可以询问我关于爱尔兰的景点、交通、天气、美食、签证等问题，或者询问如何联系我们。';
            
            for (let key in this.qaData) {
                if (message.includes(key)) {
                    response = this.qaData[key];
                    break;
                }
            }
            
            this.addMessage(response, 'ai');
        }, 1000);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.innerHTML = text.replace(/\n/g, '<br>');
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// 照片墙功能
class Gallery {
    constructor() {
        this.grid = document.querySelector('.gallery-grid');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.photos = [];

        this.init();
    }

    init() {
        this.loadPhotos();
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', () => this.filterPhotos(btn));
        });
    }

    loadPhotos() {
        // 模拟照片数据
        const mockPhotos = [
            { url: 'https://picsum.photos/400/300?random=1', category: '都柏林' },
            { url: 'https://picsum.photos/400/300?random=2', category: '都柏林' },
            { url: 'https://picsum.photos/400/300?random=3', category: '基拉尼' },
            { url: 'https://picsum.photos/400/300?random=4', category: '基拉尼' },
            { url: 'https://picsum.photos/400/300?random=5', category: '丁格尔' },
            { url: 'https://picsum.photos/400/300?random=6', category: '丁格尔' },
            { url: 'https://picsum.photos/400/300?random=7', category: '高威' },
            { url: 'https://picsum.photos/400/300?random=8', category: '高威' }
        ];

        this.photos = mockPhotos;
        this.renderPhotos();
    }

    renderPhotos() {
        this.grid.innerHTML = '';
        this.photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <img src="${photo.url}" alt="旅行照片">
                <div class="photo-overlay">
                    <div class="photo-info">
                        <h3>${photo.category}</h3>
                        <p>点击查看详情</p>
                    </div>
                </div>
            `;
            this.grid.appendChild(photoElement);
        });
    }

    filterPhotos(btn) {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.textContent;
        if (category === '全部') {
            this.renderPhotos();
        } else {
            const filteredPhotos = this.photos.filter(photo => photo.category === category);
            this.grid.innerHTML = '';
            filteredPhotos.forEach(photo => {
                const photoElement = document.createElement('div');
                photoElement.className = 'photo-item';
                photoElement.innerHTML = `
                    <img src="${photo.url}" alt="旅行照片">
                    <div class="photo-overlay">
                        <div class="photo-info">
                            <h3>${photo.category}</h3>
                            <p>点击查看详情</p>
                        </div>
                    </div>
                `;
                this.grid.appendChild(photoElement);
            });
        }
    }
}

// 联系表单处理
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // 这里可以添加发送到服务器的逻辑
        alert('感谢您的留言！我们会尽快回复您。');
        this.form.reset();
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    new ParticleBackground();
    new Globe();
    new ChatWidget();
    new Gallery();
    new ContactForm();
}); 