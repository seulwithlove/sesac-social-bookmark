# 📚 SBM (Social Bookmark Manager)

> 청년취업사관학교 새싹(SESAC) 풀스택 과정 - 프로젝트 1<br>
> 2025.8 ~ 2025.10(진행중)<br>

## 🎯 프로젝트 개요
> Next.js(App Router)와 Prisma를 기반으로<br> 인증, 상태 관리, 서버 액션 등 **풀스택 개발 패턴** 학습

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.15.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)


### 소셜 북마크 관리 플랫폼
- 사용자들이 북마크를 생성·공유, 다른 사용자의 북마크를 팔로우할 수 있는 웹 애플리케이션
- 취향에 맞는 정보를 손쉽게 찾고 공유하며 소통 가능



## 주요 기능

#### 🔐 인증 및 사용자 관리 (💬 진행중)
- **다중 OAuth 로그인**: **NextAuth v5, Google·GitHub·Kakao·Naver** (☑️)
- **이메일 인증 시스템**: 회원가입 시 이메일 인증 필수 - **Nodemailer, JWT** (☑️)
- **비밀번호 찾기**: 이메일 기반 비밀번호 재설정 - **서버 액션 + bcryptjs** (☑️)
- **프로필 관리**: 닉네임, 이미지, 개인정보 수정 가능 - **Prisma ORM, 서버 액션** (💬)

#### 📖 북케이스 (Book) 시스템 
- 북마크 컬렉션 생성 및 관리
- 공개/비공개 설정
- 다른 사용자의 북케이스 팔로우
- 북케이스별 북마크 조회

#### 🔖 북마크 (Mark) 관리 
- URL 기반 북마크 저장
- 북마크에 대한 좋아요 기능
- 북마크에 대한 댓글 (Talk) 기능
- 부적절한 북마크 신고 시스템



## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React Hooks
- **Drag & Drop**: dnd-kit
- **Charts**: Recharts
- **Form Validation**: Zod

### Backend
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth v5
- **Database**: MySQL
- **ORM**: Prisma 6.15
- **Password Hashing**: bcryptjs
- **Email**: Nodemailer

### Development Tools
- **Code Quality**: Biome (Linter & Formatter)
- **Container**: Docker Compose
- **Package Manager**: pnpm

## 📁 프로젝트 구조
```
sesac-social-bookmark/
├── app/             # Next.js App Router
│ ├── api/             # API Routes
│ │ ├── auth/            # NextAuth 설정
│ │ └── sendmail/        # 이메일 발송 API
│ ├── bookcase/        # 북마크 모음 페이지
│ ├── my/              # 마이페이지
│ ├── sign/            # 로그인/회원가입
│ └── forgotpasswd/    # 비밀번호 찾기
├── components/ 
│ └── ui/ 
├── lib/               # 유틸리티 및 설정
│ ├── auth.ts            # NextAuth 설정
│ ├── db.ts              # Prisma 클라이언트
│ └── validator.ts       # 입력 검증 로직
├── prisma/            # Prisma 스키마 및 마이그레이션
└── public/            # 정적 파일
```


## 🗄 데이터베이스 스키마

- **Member**: 사용자 정보 (이메일, 닉네임, 프로필 이미지 등)
- **Book**: 북마크 컬렉션 (북케이스)
- **Mark**: 개별 북마크 (URL, 제목, 설명 등)
- **FollowBook**: 북케이스 팔로우 관계
- **Likes**: 북마크 좋아요
- **Talk**: 북마크 댓글
- **Report**: 부적절한 북마크 신고


## 📈 향후 개선 계획

### 🎨 인터랙티브 UX
- [ ] **Framer Motion** 기반 마이크로 인터랙션 (버튼, 모달, 전환 애니메이션)
- [ ] **React Hook Form + Zod**를 통한 form UX 고도화
- [ ] **커맨드 팔레트(⌘K)** 탐색 기능 — **cmdk**
- [ ] **드래그 앤 드롭 정렬** — **dnd-kit**

### 🔍 데이터 탐색 및 자동화
- [ ] **Elasticsearch**를 활용한 검색 기능 고도화
- [ ] **AI 기반 자동 태깅** (OpenAI Embedding + cosine similarity)
- [ ] **요약/추천 시스템** (유사 북마크 제안)

### ⚡ 실시간 & 시각화
- [ ] **WebSocket** 기반 실시간 알림 시스템
- [ ] **Recharts/Visx** 기반 활동 대시보드 및 히트맵 시각화



