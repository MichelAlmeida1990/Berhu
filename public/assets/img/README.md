# Imagens do Projeto Berhu

## Estrutura do Diretório

```
assets/img/
├── README.md                    # Este arquivo
├── fabiana-berhu-1.jpg         # Foto principal da Fabiana
├── fabiana-berhu-2.jpg         # Foto secundária da Fabiana
├── logos/                       # Logotipos da marca
│   ├── berhu-primary.svg       # Logo principal
│   ├── berhu-secondary.svg     # Logo secundário
│   └── concepts/               # Conceitos de identidade visual
│       ├── montanha-cosmica.svg
│       ├── flor-alquimica.svg
│       ├── mandala-sagrada.svg
│       └── agua-cristalina.svg
├── courses/                     # Imagens dos cursos
│   ├── meditation-beginner.jpg
│   ├── reiki-level1.jpg
│   ├── crystal-healing.jpg
│   └── spiritual-awakening.jpg
├── therapies/                   # Imagens das terapias
│   ├── reiki-session.jpg
│   ├── crystal-therapy.jpg
│   ├── meditation-therapy.jpg
│   └── energy-healing.jpg
├── ui/                          # Elementos de UI
│   ├── avatar-placeholder.jpg
│   ├── course-thumbnail.jpg
│   └── banner-default.jpg
└── backgrounds/                 # Imagens de fundo
    ├── hero-bg.jpg
    ├── meditation-bg.jpg
    └── therapy-bg.jpg
```

## Especificações

### Formatos Suportados
- **JPG**: Para fotos e imagens complexas
- **PNG**: Para imagens com transparência
- **SVG**: Para logos e ícones vetoriais
- **WEBP**: Para otimização web

### Dimensões Recomendadas

#### Imagens de Perfil
- **Avatar**: 200x200px (quadrado)
- **Banner**: 1200x400px (retangular)

#### Imagens de Cursos
- **Thumbnail**: 400x300px (16:9)
- **Banner**: 1200x600px (2:1)

#### Logotipos
- **Principal**: 300x100px
- **Ícone**: 64x64px
- **Favicon**: 32x32px

#### Imagens de Terapia
- **Card**: 400x300px
- **Galeria**: 800x600px

### Otimização
- Compressão: 80-90% qualidade
- Tamanho máximo: 500KB por imagem
- Formato WEBP para melhor performance

## Direitos de Uso

Todas as imagens devem ter direitos de uso comercial ou serem criadas exclusivamente para o projeto Berhu.

### Créditos Obrigatórios
- Fotos da Fabiana Berkana: Arquivo pessoal
- Imagens de stock: Unsplash, Pexels (com créditos)
- Ilustrações: Criadas por designer contratado

## Implementação

### Uso no Código
```html
<!-- Imagem responsiva -->
<img src="assets/img/courses/meditation-beginner.jpg" 
     alt="Meditação para Iniciantes" 
     class="img-responsive"
     loading="lazy">

<!-- Logo SVG -->
<img src="assets/img/logos/berhu-primary.svg" 
     alt="Berhu - Plataforma Espiritual" 
     class="logo">

<!-- Avatar com fallback -->
<img src="assets/img/ui/avatar-placeholder.jpg" 
     alt="Avatar do usuário" 
     class="avatar"
     onerror="this.src='assets/img/ui/default-avatar.jpg'">
```

### CSS para Otimização
```css
.img-responsive {
    max-width: 100%;
    height: auto;
    object-fit: cover;
}

.avatar {
    border-radius: 50%;
    object-fit: cover;
}

.logo {
    max-height: 60px;
    width: auto;
}
```

## Upload de Novas Imagens

1. Verificar formato e dimensões
2. Otimizar para web (compressão)
3. Adicionar ao diretório correspondente
4. Atualizar este README
5. Testar em diferentes dispositivos

## Manutenção

- Revisar imagens trimestralmente
- Remover imagens não utilizadas
- Otimizar para performance
- Verificar links quebrados
