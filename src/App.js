import { useMemo, useState } from "react";

const ecosystems = [
  {
    id: "huggingface",
    name: "HuggingFace",
    color: "#ff9d00",
    bg: "#1a1200",
    desc: "모델 허브 + 오픈소스 ML 라이브러리 생태계. 학습/파인튜닝/배포용 도구가 촘촘하게 연결된 허브.",
    libs: ["Transformers", "PEFT", "TRL", "TGI", "Accelerate", "Datasets", "Tokenizers", "Diffusers"],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    color: "#76b900",
    bg: "#0a1400",
    desc: "GPU 하드웨어와 CUDA 기반 가속 스택의 중심. 대규모 학습/추론 인프라에서 영향력이 가장 큼.",
    libs: ["CUDA", "cuDNN", "TensorRT", "NeMo", "Triton Inference Server"],
  },
  {
    id: "google",
    name: "Google / DeepMind",
    color: "#4285f4",
    bg: "#00071a",
    desc: "JAX/Flax 연구 스택과 TPU, Vertex AI를 아우르는 생태계. 연구에서 클라우드 운영까지 이어짐.",
    libs: ["JAX", "Flax", "Keras", "TensorFlow", "Vertex AI", "TPU"],
  },
  {
    id: "meta",
    name: "Meta AI",
    color: "#0082fb",
    bg: "#00071a",
    desc: "PyTorch 중심 생태계와 Llama 계열 오픈 모델 영향력이 큰 축. 모델·학습·임베딩 인프라에 존재감이 큼.",
    libs: ["PyTorch", "FAISS", "torchtune", "ExecuTorch"],
  },
  {
    id: "microsoft",
    name: "Microsoft",
    color: "#00a4ef",
    bg: "#00111a",
    desc: "엔터프라이즈 AI 스택. DeepSpeed, ONNX Runtime, AutoGen, Semantic Kernel 등 운영 친화적 도구가 강점.",
    libs: ["DeepSpeed", "ONNX Runtime", "AutoGen", "Semantic Kernel", "Azure OpenAI"],
  },
  {
    id: "langchain",
    name: "LangChain",
    color: "#1c7ed6",
    bg: "#00071a",
    desc: "LLM 앱/에이전트 개발 생태계. 빠른 시작용 고수준 API와, LangGraph 기반 저수준 오케스트레이션을 함께 제공.",
    libs: ["LangChain", "LangGraph", "LangSmith"],
  },
];

const appCapabilityLegend = [
  { id: "mcp", label: "MCP", color: "#7dd3fc", desc: "MCP 서버/도구 연동" },
  { id: "tools", label: "Tools", color: "#86efac", desc: "함수/도구 호출" },
  { id: "workflow", label: "Workflow", color: "#f9a8d4", desc: "명시적 워크플로/그래프" },
  { id: "multi_agent", label: "Multi-Agent", color: "#fca5a5", desc: "멀티 에이전트 오케스트레이션" },
  { id: "memory", label: "Memory", color: "#c4b5fd", desc: "단기/장기 메모리" },
  { id: "hitl", label: "HITL", color: "#fdba74", desc: "Human-in-the-loop" },
  { id: "durable", label: "Durable", color: "#93c5fd", desc: "체크포인트/지속 실행" },
  { id: "structured", label: "Structured", color: "#fcd34d", desc: "JSON/스키마 기반 구조화 출력" },
  { id: "rag", label: "RAG", color: "#5eead4", desc: "검색·인덱싱·RAG 친화" },
  { id: "observe", label: "Observe", color: "#d8b4fe", desc: "추적/평가/관측성" },
  { id: "deploy", label: "Deploy", color: "#bef264", desc: "서버/프로덕션 배포 친화" },
];

const layers = [
  {
    id: "hardware",
    label: "Layer 0",
    title: "Hardware / Driver Layer",
    color: "#1a1a2e",
    accent: "#e94560",
    textColor: "#ff6b8a",
    description: "물리적 연산 장치와 저수준 드라이버/런타임. 모든 학습·추론의 기반이 되는 최하단 계층.",
    libs: [
      { name: "CUDA", org: "NVIDIA", ecosystem: "nvidia", desc: "NVIDIA GPU 병렬 연산 플랫폼이자 핵심 소프트웨어 스택. 현대 GPU 학습/추론의 중심 축", use: "GPU 연산 기반", hot: true },
      { name: "cuDNN", org: "NVIDIA", ecosystem: "nvidia", desc: "딥러닝 연산용 가속 라이브러리. convolution, attention 등 핵심 연산 최적화 제공", use: "딥러닝 연산 가속", hot: false },
      { name: "ROCm", org: "AMD", ecosystem: null, desc: "AMD GPU용 오픈소스 컴퓨팅 플랫폼. CUDA 대안으로 점차 지원 범위 확대 중", use: "AMD GPU 연산", hot: false },
      { name: "Metal", org: "Apple", ecosystem: null, desc: "Apple Silicon 및 Apple GPU를 위한 저수준 그래픽/컴퓨트 API. MLX 등 Apple ML 스택의 기반", use: "Mac/iOS 연산", hot: false },
      { name: "TPU", org: "Google", ecosystem: "google", desc: "Google의 텐서 연산 특화 가속기. JAX/XLA 기반 대규모 학습과 강한 결합", use: "TPU 학습/추론", hot: false },
      { name: "Triton (GPU kernel)", org: "OpenAI / triton-lang", ecosystem: null, desc: "Python 기반 커스텀 GPU 커널 작성 언어/컴파일러. CUDA 커널 개발 생산성을 높여줌", use: "커스텀 연산 최적화", hot: true },
    ]
  },
  {
    id: "compute",
    label: "Layer 1",
    title: "Numerical / Tensor Compute Layer",
    color: "#16213e",
    accent: "#f5a623",
    textColor: "#ffc85c",
    description: "텐서 연산, 자동미분, 컴파일/JIT 등 수학적 실행 엔진 계층. 모델 학습/추론의 핵심 런타임.",
    libs: [
      { name: "PyTorch", org: "Meta", ecosystem: "meta", desc: "동적 그래프 중심 딥러닝 프레임워크. 연구와 실무 모두에서 가장 널리 쓰이는 축 중 하나", use: "모델 개발/학습", hot: true },
      { name: "JAX", org: "Google", ecosystem: "google", desc: "grad/jit/vmap/pmap 같은 함수형 변환 중심 수치 연산 프레임워크. XLA 및 TPU 활용에 강점", use: "연구/TPU 학습", hot: true },
      { name: "TensorFlow", org: "Google", ecosystem: "google", desc: "오랜 기간 사용된 ML 프레임워크. 현재 최전선 연구 표준은 아니지만 배포/기존 자산이 많음", use: "모델 개발/배포", hot: false },
      { name: "Keras", org: "Google", ecosystem: "google", desc: "고수준 신경망 API. Keras 3 기준 TensorFlow, JAX, PyTorch 멀티백엔드 지원", use: "고수준 모델 작성", hot: true },
      { name: "NumPy", org: "Community", ecosystem: null, desc: "Python 배열 연산의 사실상 표준. AI 라이브러리 다수가 NumPy 스타일 인터페이스를 계승", use: "데이터 전처리/연산", hot: false },
      { name: "MLX", org: "Apple", ecosystem: null, desc: "Apple Silicon 최적화 배열/오토그라드 프레임워크. 로컬 학습·추론 모두 가능", use: "Mac 로컬 학습/추론", hot: true },
      { name: "Flax", org: "Google", ecosystem: "google", desc: "JAX 기반 신경망 라이브러리. 연구용 모델 구성과 실험 코드에 자주 쓰임", use: "JAX 기반 모델 개발", hot: false },
    ]
  },
  {
    id: "training",
    label: "Layer 2",
    title: "Training / Fine-tuning / Data Pipeline Layer",
    color: "#0f3460",
    accent: "#00b4d8",
    textColor: "#48cae4",
    description: "모델 학습, 파인튜닝, 데이터 파이프라인에 가까운 계층. 대규모 분산학습부터 소비자 GPU 기반 LoRA까지 포함.",
    libs: [
      { name: "Transformers", org: "HuggingFace", ecosystem: "huggingface", desc: "사전학습 모델 로딩/학습/추론용 범용 라이브러리. 텍스트 모델 생태계의 중심 축", use: "모델 로드/파인튜닝", hot: true },
      { name: "Accelerate", org: "HuggingFace", ecosystem: "huggingface", desc: "PyTorch 분산학습 추상화. 단일 GPU에서 멀티 GPU/TPU까지 이식 비용을 줄여줌", use: "분산학습 간소화", hot: true },
      { name: "Datasets", org: "HuggingFace", ecosystem: "huggingface", desc: "Arrow 기반 데이터 처리 라이브러리. 학습 데이터 로딩·전처리·스트리밍에 강점", use: "학습/평가 데이터 처리", hot: true },
      { name: "Tokenizers", org: "HuggingFace", ecosystem: "huggingface", desc: "Rust 기반 고속 토크나이저. 학습과 추론 전처리 모두의 핵심 구성요소", use: "텍스트 토크나이징", hot: false },
      { name: "PEFT", org: "HuggingFace", ecosystem: "huggingface", desc: "LoRA/QLoRA/Adapter 등 파라미터 효율적 파인튜닝 구현 모음", use: "경량 파인튜닝", hot: true },
      { name: "TRL", org: "HuggingFace", ecosystem: "huggingface", desc: "SFT, DPO, PPO 등 정렬(alignment) 및 후학습 워크플로를 위한 툴킷", use: "정렬/후학습", hot: true },
      { name: "Diffusers", org: "HuggingFace", ecosystem: "huggingface", desc: "이미지·비디오 생성 모델 라이브러리. diffusion 계열 모델 사용/파인튜닝에 강점", use: "생성 이미지 모델", hot: true },
      { name: "DeepSpeed", org: "Microsoft", ecosystem: "microsoft", desc: "대규모 분산학습 최적화 라이브러리. ZeRO 계열 기법으로 메모리 효율 향상", use: "대규모 모델 학습", hot: true },
      { name: "Megatron-LM", org: "NVIDIA", ecosystem: "nvidia", desc: "텐서/파이프라인 병렬화 중심의 대규모 LLM 사전학습 프레임워크", use: "LLM 사전학습", hot: false },
      { name: "Axolotl", org: "OpenAccess AI", ecosystem: null, desc: "YAML 중심 LLM 파인튜닝 자동화 프레임워크. LoRA/QLoRA/FSDP 설정 관리가 편리", use: "파인튜닝 자동화", hot: true },
      { name: "Unsloth", org: "Community", ecosystem: null, desc: "LoRA/QLoRA 중심의 공격적 최적화 프레임워크. 적은 자원으로 빠른 파인튜닝에 적합", use: "빠른 로컬 파인튜닝", hot: true },
      { name: "torchtune", org: "Meta", ecosystem: "meta", desc: "PyTorch 네이티브 LLM 파인튜닝 라이브러리. 설정 기반으로 비교적 깔끔한 학습 파이프라인 제공", use: "PyTorch 네이티브 파인튜닝", hot: false },
      { name: "Lightning AI", org: "Lightning AI", ecosystem: null, desc: "PyTorch 학습 루프 추상화 도구. 실험 코드 구조화와 분산 훈련 보일러플레이트 감소", use: "학습 코드 구조화", hot: false },
      { name: "NeMo", org: "NVIDIA", ecosystem: "nvidia", desc: "NVIDIA의 엔터프라이즈 지향 학습 프레임워크. LLM/음성/멀티모달 영역 지원", use: "엔터프라이즈 AI 학습", hot: false },
    ]
  },
  {
    id: "inference",
    label: "Layer 3",
    title: "Inference / Optimization / Serving Layer",
    color: "#1b4332",
    accent: "#52b788",
    textColor: "#74c69d",
    description: "학습된 모델을 빠르게 실행하고 서비스로 노출하는 계층. 처리량, 지연시간, 메모리 효율, 운영 편의성이 핵심.",
    libs: [
      { name: "vLLM", org: "vLLM Project", ecosystem: null, desc: "PagedAttention 기반 고성능 LLM 서빙 엔진. OpenAI 호환 서버 인터페이스 제공", use: "고성능 LLM 서빙", hot: true },
      { name: "SGLang", org: "SGLang", ecosystem: null, desc: "구조화 출력과 복잡한 추론 흐름 최적화에 강점이 있는 고성능 서빙/실행 프레임워크", use: "구조화 출력/고성능 서빙", hot: true },
      { name: "llama.cpp", org: "ggml-org", ecosystem: null, desc: "C/C++ 기반 로컬 추론 엔진. GGUF 양자화 모델 실행의 대표 축", use: "로컬/엣지 추론", hot: true },
      { name: "Ollama", org: "Ollama", ecosystem: null, desc: "로컬 모델 실행을 단순화하는 런타임/패키징 도구. REST API와 쉬운 배포 경험 제공", use: "로컬 LLM 실행", hot: true },
      { name: "TGI", org: "HuggingFace", ecosystem: "huggingface", desc: "Hugging Face 모델용 프로덕션 추론 서버. 텍스트 생성 서빙에 최적화", use: "HF 모델 서빙", hot: false },
      { name: "TensorRT", org: "NVIDIA", ecosystem: "nvidia", desc: "GPU 추론 최적화 엔진. 양자화, 레이어 융합, 엔진 빌드 등으로 지연시간 단축에 초점", use: "GPU 추론 최적화", hot: true },
      { name: "Triton Inference Server", org: "NVIDIA", ecosystem: "nvidia", desc: "다양한 백엔드를 통합하는 추론 서버. TensorRT, ONNX, PyTorch 등을 하나의 서버로 운영 가능", use: "엔터프라이즈 모델 서빙", hot: false },
      { name: "ONNX Runtime", org: "Microsoft", ecosystem: "microsoft", desc: "ONNX 포맷 모델의 범용 추론 런타임. CPU/GPU/엣지 배포에 활용", use: "크로스플랫폼 추론", hot: false },
      { name: "ExLlamaV2", org: "Community", ecosystem: null, desc: "GPTQ/EXL2 양자화 모델의 단일 GPU 추론 최적화에 강점", use: "양자화 모델 GPU 추론", hot: false },
      { name: "LMDeploy", org: "Shanghai AI Lab", ecosystem: null, desc: "LLM 배포용 엔진 및 도구 모음. 일부 양자화/서빙 최적화 시나리오에 강점", use: "LLM 서빙", hot: false },
      { name: "MLX", org: "Apple", ecosystem: null, desc: "Apple Silicon 환경에서 로컬 추론 경로로도 활용 가능. Python 기반 실험/앱 연결이 쉬움", use: "Mac 로컬 추론", hot: true },
      { name: "ExecuTorch", org: "Meta", ecosystem: "meta", desc: "PyTorch 계열의 온디바이스 추론 솔루션. 모바일/엣지 배포 지향", use: "모바일/엣지 추론", hot: false },
    ]
  },
  {
    id: "platform",
    label: "Layer 4",
    title: "MLOps / Platform / Evaluation Layer",
    color: "#3d1a78",
    accent: "#b98eff",
    textColor: "#c9a9ff",
    description: "실험 추적, 평가, 배포 자동화, 데이터/모델 관리 계층. 연구 산출물을 운영 환경으로 연결하는 브리지.",
    libs: [
      { name: "Weights & Biases", org: "W&B", ecosystem: null, desc: "실험 추적, sweep, 아티팩트/모델 관리, 평가를 제공하는 대표 플랫폼", use: "실험 관리/관측성", hot: true },
      { name: "MLflow", org: "Databricks", ecosystem: null, desc: "오픈소스 ML 라이프사이클 관리 도구. 추적, 레지스트리, 배포 흐름을 지원", use: "ML 파이프라인 관리", hot: true },
      { name: "Ray", org: "Anyscale", ecosystem: null, desc: "분산 Python 컴퓨팅 프레임워크. 학습/서빙/데이터 처리 전반을 확장 가능", use: "분산 학습/서빙", hot: true },
      { name: "LangSmith", org: "LangChain", ecosystem: "langchain", desc: "LLM 앱/에이전트 추적, 평가, 디버깅, 관측성 플랫폼", use: "LLM 앱 관측성", hot: true },
      { name: "Kubeflow", org: "Google", ecosystem: "google", desc: "Kubernetes 기반 ML 파이프라인 오케스트레이션 플랫폼", use: "엔터프라이즈 MLOps", hot: false },
      { name: "BentoML", org: "BentoML", ecosystem: null, desc: "모델 패키징과 API 서버 배포를 단순화하는 배포 프레임워크", use: "모델 API 배포", hot: false },
      { name: "DVC", org: "Iterative", ecosystem: null, desc: "데이터/모델 버전 관리 도구. Git 기반 워크플로와 결합하기 좋음", use: "데이터 버전 관리", hot: false },
      { name: "Comet ML", org: "Comet", ecosystem: null, desc: "실험 추적과 모델 관리 플랫폼. 일부 온프레미스 시나리오에 강점", use: "실험 추적", hot: false },
    ]
  },
  {
    id: "application",
    label: "Layer 5",
    title: "Application / Agent / Orchestration Layer",
    color: "#4a1942",
    accent: "#ff6eb4",
    textColor: "#ff9ccc",
    description: "LLM 앱, 에이전트, RAG, 멀티스텝 워크플로우를 구성하는 계층. 최근에는 MCP, tool calling, durable workflow, observability가 핵심 평가 포인트.",
    libs: [
      {
        name: "LangChain",
        org: "LangChain",
        ecosystem: "langchain",
        desc: "고수준 LLM 앱 개발 프레임워크. 빠른 프로토타이핑과 넓은 통합 생태계가 강점",
        use: "LLM 앱 개발",
        hot: true,
        capabilities: ["mcp", "tools", "memory", "structured", "rag"]
      },
      {
        name: "LangGraph",
        org: "LangChain",
        ecosystem: "langchain",
        desc: "상태 기반 그래프 오케스트레이터. durable execution, persistence, HITL, streaming이 핵심 강점",
        use: "에이전트 워크플로우",
        hot: true,
        capabilities: ["mcp", "tools", "workflow", "memory", "hitl", "durable", "observe", "deploy"]
      },
      {
        name: "LlamaIndex",
        org: "LlamaIndex",
        ecosystem: null,
        desc: "데이터 연결과 RAG 구축에 강한 프레임워크. 문서 인덱싱, 검색, 에이전트형 질의 흐름에 적합",
        use: "RAG 구축",
        hot: true,
        capabilities: ["tools", "workflow", "memory", "rag", "observe"]
      },
      {
        name: "DSPy",
        org: "Stanford NLP",
        ecosystem: null,
        desc: "프롬프트를 직접 손으로 맞추기보다 프로그램을 선언하고 최적화하는 프레임워크. 최근에는 agent/tool use와 MCP도 지원",
        use: "프롬프트/에이전트 최적화",
        hot: true,
        capabilities: ["mcp", "tools", "workflow", "structured", "rag", "observe"]
      },
      {
        name: "Instructor",
        org: "jxnl",
        ecosystem: null,
        desc: "Pydantic 중심 구조화 출력 라이브러리. JSON/스키마 기반 응답 안정화에 특화",
        use: "구조화 출력 추출",
        hot: true,
        capabilities: ["structured", "tools"]
      },
      {
        name: "CrewAI",
        org: "CrewAI",
        ecosystem: null,
        desc: "역할 기반 멀티 에이전트 프레임워크. Crew/Flow 개념과 MCP 통합을 제공",
        use: "멀티 에이전트",
        hot: true,
        capabilities: ["mcp", "tools", "workflow", "multi_agent", "memory", "observe", "deploy"]
      },
      {
        name: "AutoGen",
        org: "Microsoft",
        ecosystem: "microsoft",
        desc: "대화형 멀티 에이전트 프레임워크. 코드 실행, 분산 런타임, MCP workbench 등 확장 포인트가 풍부",
        use: "에이전트 협업",
        hot: true,
        capabilities: ["mcp", "tools", "workflow", "multi_agent", "memory"]
      },
      {
        name: "Semantic Kernel",
        org: "Microsoft",
        ecosystem: "microsoft",
        desc: ".NET/Python/Java 중심 엔터프라이즈 오케스트레이터. plugin, agent, MCP plugin 연동에 강점",
        use: "엔터프라이즈 LLM 통합",
        hot: true,
        capabilities: ["mcp", "tools", "workflow", "multi_agent", "memory", "structured", "deploy"]
      },
      {
        name: "Haystack",
        org: "deepset",
        ecosystem: null,
        desc: "RAG와 검색 파이프라인 구성에 강한 프레임워크. 컴포넌트 기반 파이프라인 설계가 특징",
        use: "RAG 파이프라인",
        hot: false,
        capabilities: ["tools", "workflow", "rag", "observe"]
      },
      {
        name: "Guidance",
        org: "Microsoft",
        ecosystem: "microsoft",
        desc: "정규식/문법/제약 기반 출력 제어에 강한 라이브러리. constrained decoding 계열 사용처에 적합",
        use: "출력 포맷 제어",
        hot: false,
        capabilities: ["structured", "tools"]
      },
    ]
  },
  {
    id: "data",
    label: "Layer 6",
    title: "Data / Embedding / Retrieval Layer",
    color: "#1a3a4a",
    accent: "#00cfcf",
    textColor: "#4de8e8",
    description: "벡터 저장소, 임베딩, 검색 인덱스 계층. RAG의 저장·검색 기반을 담당.",
    libs: [
      { name: "Chroma", org: "Chroma", ecosystem: null, desc: "로컬 개발과 프로토타이핑에 쉬운 오픈소스 벡터 DB", use: "벡터 검색 (개발)", hot: true },
      { name: "Pinecone", org: "Pinecone", ecosystem: null, desc: "완전 관리형 벡터 검색 서비스. 운영형 RAG 인프라 후보로 자주 검토됨", use: "벡터 검색 (프로덕션)", hot: true },
      { name: "Qdrant", org: "Qdrant", ecosystem: null, desc: "Rust 기반 고성능 벡터 DB. 필터링과 자체 호스팅 시나리오에서 인기가 높음", use: "고성능 벡터 검색", hot: true },
      { name: "Weaviate", org: "Weaviate", ecosystem: null, desc: "벡터+키워드 하이브리드 검색을 지원하는 벡터 DB", use: "하이브리드 검색", hot: false },
      { name: "pgvector", org: "Community", ecosystem: null, desc: "PostgreSQL 벡터 확장. 기존 관계형 DB 인프라 위에 벡터 검색을 얹을 수 있음", use: "DB 통합 벡터 검색", hot: true },
      { name: "FAISS", org: "Meta", ecosystem: "meta", desc: "고성능 ANN 검색 라이브러리. 벡터 검색 시스템의 기반 구성요소로 널리 사용", use: "벡터 인덱스 라이브러리", hot: false },
      { name: "sentence-transformers", org: "HuggingFace", ecosystem: "huggingface", desc: "문장 임베딩과 리랭킹에 널리 쓰이는 라이브러리. 로컬 검색 품질 개선에 자주 사용", use: "임베딩/리랭킹", hot: true },
      { name: "Milvus", org: "Zilliz", ecosystem: null, desc: "대규모 벡터 검색을 위한 클라우드 네이티브 오픈소스 DB", use: "대규모 벡터 검색", hot: false },
    ]
  },
];

const ecoColors = {
  huggingface: "#ff9d00",
  nvidia: "#76b900",
  google: "#4285f4",
  meta: "#0082fb",
  microsoft: "#00a4ef",
  langchain: "#1c7ed6",
};

const ecoNames = {
  huggingface: "🤗 HF",
  nvidia: "⚡ NVIDIA",
  google: "🔵 Google",
  meta: "🔷 Meta",
  microsoft: "🪟 MS",
  langchain: "🦜 LC",
};

const relationshipMap = {
  "PyTorch": ["CUDA", "cuDNN"],
  "JAX": ["TPU", "CUDA"],
  "Flax": ["JAX"],
  "TensorFlow": ["Keras", "CUDA", "cuDNN"],
  "Keras": ["TensorFlow", "JAX", "PyTorch"],
  "vLLM": ["PyTorch", "CUDA", "Triton (GPU kernel)"],
  "SGLang": ["PyTorch", "CUDA"],
  "llama.cpp": ["Metal", "CUDA"],
  "Ollama": ["llama.cpp"],
  "TGI": ["Transformers", "PyTorch"],
  "Transformers": ["PyTorch", "TensorFlow", "JAX", "Tokenizers"],
  "Accelerate": ["PyTorch", "DeepSpeed"],
  "PEFT": ["Transformers", "Accelerate"],
  "TRL": ["Transformers", "PEFT"],
  "Diffusers": ["Transformers", "PyTorch"],
  "Datasets": ["Tokenizers"],
  "DeepSpeed": ["PyTorch"],
  "Unsloth": ["PyTorch", "PEFT", "Triton (GPU kernel)"],
  "Axolotl": ["Transformers", "PEFT", "Accelerate", "DeepSpeed"],
  "torchtune": ["PyTorch", "PEFT"],
  "NeMo": ["PyTorch", "Megatron-LM"],
  "Megatron-LM": ["PyTorch", "CUDA"],
  "LangChain": ["LangGraph", "vLLM", "Ollama", "Pinecone", "Chroma"],
  "LangGraph": ["LangChain"],
  "LangSmith": ["LangChain", "LangGraph"],
  "LlamaIndex": ["Qdrant", "Pinecone", "pgvector", "FAISS", "sentence-transformers"],
  "Ray": ["PyTorch", "vLLM"],
  "sentence-transformers": ["Transformers"],
  "MLX": ["Metal"],
  "Triton Inference Server": ["TensorRT", "ONNX Runtime"],
  "ONNX Runtime": ["ONNX"],
  "TensorRT": ["CUDA", "cuDNN"],
  "ExecuTorch": ["PyTorch"],
  "DSPy": ["Instructor"],
};

const appOnlyNames = new Set(layers.find((l) => l.id === "application")?.libs.map((lib) => lib.name) || []);

function CapabilityPill({ capId }) {
  const meta = appCapabilityLegend.find((c) => c.id === capId);
  if (!meta) return null;
  return (
    <span
      title={meta.desc}
      style={{
        fontSize: "8px",
        color: meta.color,
        background: `${meta.color}14`,
        border: `1px solid ${meta.color}35`,
        padding: "2px 6px",
        borderRadius: "999px",
        letterSpacing: "0.3px",
      }}
    >
      {meta.label}
    </span>
  );
}

export default function AIEcosystem() {
  const [activeLayer, setActiveLayer] = useState(null);
  const [activeLib, setActiveLib] = useState(null);
  const [filterEco, setFilterEco] = useState(null);
  const [view, setView] = useState("layers");
  const [capabilityFilter, setCapabilityFilter] = useState(null);

  const related = activeLib ? (relationshipMap[activeLib] || []) : [];

  const filteredLayers = useMemo(() => {
    return layers.map((layer) => {
      let libs = filterEco ? layer.libs.filter((lib) => lib.ecosystem === filterEco) : layer.libs;
      if (layer.id === "application" && capabilityFilter) {
        libs = libs.filter((lib) => lib.capabilities?.includes(capabilityFilter));
      }
      return { ...layer, libs };
    });
  }, [filterEco, capabilityFilter]);

  const totalLibs = layers.reduce((acc, l) => acc + l.libs.length, 0);

  return (
    <div style={{
      background: "#080c14",
      minHeight: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      color: "#c8d6e5",
    }}>
      <div style={{
        borderBottom: "1px solid #1e2d3d",
        padding: "24px 40px",
        background: "linear-gradient(180deg, #0d1b2a 0%, #080c14 100%)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        backdropFilter: "blur(10px)",
      }}>
        <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", gap: "20px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#4a6fa5", letterSpacing: "4px", marginBottom: "4px" }}>FIELD GUIDE v3</div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#e8f4fd" }}>
                AI / ML / Agent Ecosystem
              </h1>
              <div style={{ fontSize: "10px", color: "#4a6fa5", marginTop: "3px" }}>
                {totalLibs} libraries · {layers.length} layers · {ecosystems.length} ecosystems
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {["layers", "grid"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: "6px 14px",
                    background: view === v ? "#1e3a5f" : "transparent",
                    border: `1px solid ${view === v ? "#4a90d9" : "#1e2d3d"}`,
                    borderRadius: "4px",
                    color: view === v ? "#7eb8f7" : "#4a6fa5",
                    cursor: "pointer",
                    fontSize: "10px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
            <button
              onClick={() => setFilterEco(null)}
              style={{
                padding: "4px 12px",
                background: !filterEco ? "#1e3a5f" : "transparent",
                border: `1px solid ${!filterEco ? "#4a90d9" : "#1e2d3d"}`,
                borderRadius: "20px",
                color: !filterEco ? "#7eb8f7" : "#4a6fa5",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              All
            </button>
            {ecosystems.map((eco) => (
              <button
                key={eco.id}
                onClick={() => setFilterEco(filterEco === eco.id ? null : eco.id)}
                style={{
                  padding: "4px 12px",
                  background: filterEco === eco.id ? `${eco.color}20` : "transparent",
                  border: `1px solid ${filterEco === eco.id ? eco.color + "80" : "#1e2d3d"}`,
                  borderRadius: "20px",
                  color: filterEco === eco.id ? eco.color : "#4a6fa5",
                  cursor: "pointer",
                  fontSize: "10px",
                  transition: "all 0.15s",
                }}
              >
                {eco.name}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              onClick={() => setCapabilityFilter(null)}
              style={{
                padding: "4px 10px",
                background: !capabilityFilter ? "#31224e" : "transparent",
                border: `1px solid ${!capabilityFilter ? "#b98eff" : "#1e2d3d"}`,
                borderRadius: "20px",
                color: !capabilityFilter ? "#d8c2ff" : "#6b5b8f",
                cursor: "pointer",
                fontSize: "10px",
              }}
            >
              App tags: All
            </button>
            {appCapabilityLegend.map((cap) => (
              <button
                key={cap.id}
                onClick={() => setCapabilityFilter(capabilityFilter === cap.id ? null : cap.id)}
                style={{
                  padding: "4px 10px",
                  background: capabilityFilter === cap.id ? `${cap.color}18` : "transparent",
                  border: `1px solid ${capabilityFilter === cap.id ? `${cap.color}80` : "#1e2d3d"}`,
                  borderRadius: "20px",
                  color: capabilityFilter === cap.id ? cap.color : "#6b5b8f",
                  cursor: "pointer",
                  fontSize: "10px",
                }}
                title={cap.desc}
              >
                {cap.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "28px 40px", maxWidth: "1240px", margin: "0 auto" }}>
        {!filterEco && (
          <div style={{ marginBottom: "32px" }}>
            <div style={{ fontSize: "10px", color: "#4a6fa5", letterSpacing: "2px", marginBottom: "12px" }}>
              MAJOR ECOSYSTEMS
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "8px" }}>
              {ecosystems.map((eco) => (
                <div
                  key={eco.id}
                  onClick={() => setFilterEco(eco.id)}
                  style={{
                    padding: "14px 16px",
                    background: "#0d1b2a",
                    border: `1px solid #1e2d3d`,
                    borderLeft: `3px solid ${eco.color}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: eco.color }}>{eco.name}</span>
                  </div>
                  <div style={{ fontSize: "10px", color: "#4a6fa5", lineHeight: 1.5, marginBottom: "8px" }}>
                    {eco.desc}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                    {eco.libs.map((lib) => (
                      <span
                        key={lib}
                        style={{
                          fontSize: "9px",
                          color: eco.color,
                          background: eco.color + "15",
                          border: `1px solid ${eco.color}30`,
                          padding: "2px 6px",
                          borderRadius: "3px",
                        }}
                      >
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === "layers" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {filteredLayers.map((layer) => {
              if (filterEco && layer.libs.length === 0) return null;
              if (capabilityFilter && layer.id === "application" && layer.libs.length === 0) return null;
              const isActive = activeLayer === layer.id;
              return (
                <div key={layer.id}>
                  <div
                    onClick={() => setActiveLayer(isActive ? null : layer.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "13px 20px",
                      background: isActive ? `${layer.color}ee` : `${layer.color}88`,
                      border: `1px solid ${isActive ? layer.accent + "60" : "#1e2d3d"}`,
                      borderRadius: isActive ? "8px 8px 0 0" : "6px",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderLeft: `3px solid ${layer.accent}`,
                    }}
                  >
                    <div style={{ fontSize: "10px", color: layer.accent, letterSpacing: "2px", minWidth: "52px", fontWeight: 700 }}>
                      {layer.label}
                    </div>
                    <div style={{ fontSize: "13px", color: "#e8f4fd", fontWeight: 600, flex: 1 }}>
                      {layer.title}
                    </div>
                    <div style={{ fontSize: "10px", color: "#4a6fa5", marginRight: "8px" }}>
                      {layer.libs.length} libs
                    </div>
                    <div
                      style={{
                        fontSize: "16px",
                        color: layer.accent,
                        transform: isActive ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                      }}
                    >
                      ›
                    </div>
                  </div>

                  {isActive && (
                    <div
                      style={{
                        background: `${layer.color}44`,
                        border: `1px solid ${layer.accent}25`,
                        borderTop: "none",
                        borderRadius: "0 0 8px 8px",
                        padding: "18px",
                      }}
                    >
                      <p style={{ fontSize: "11px", color: "#5a7fa5", margin: "0 0 16px 0", lineHeight: 1.6 }}>
                        {layer.description}
                      </p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "8px" }}>
                        {layer.libs.map((lib) => {
                          const isRelated = related.includes(lib.name);
                          const isSelected = activeLib === lib.name;
                          const ecoColor = lib.ecosystem ? ecoColors[lib.ecosystem] : null;
                          return (
                            <div
                              key={lib.name}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveLib(isSelected ? null : lib.name);
                              }}
                              style={{
                                padding: "13px 15px",
                                background: isSelected ? `${layer.accent}12` : "#0b1520",
                                border: `1px solid ${isSelected ? layer.accent + "70" : isRelated ? "#f5a62330" : "#1a2a3a"}`,
                                borderRadius: "6px",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px", flexWrap: "wrap" }}>
                                <span style={{ fontSize: "12px", fontWeight: 700, color: layer.textColor }}>
                                  {lib.name}
                                </span>
                                {lib.hot && (
                                  <span style={{ fontSize: "8px", background: "#ff4d4d18", color: "#ff6b6b", border: "1px solid #ff4d4d35", padding: "1px 5px", borderRadius: "3px", letterSpacing: "1px" }}>
                                    HOT
                                  </span>
                                )}
                                {ecoColor && (
                                  <span style={{ fontSize: "8px", color: ecoColor, background: ecoColor + "15", border: `1px solid ${ecoColor}30`, padding: "1px 6px", borderRadius: "3px", marginLeft: "2px" }}>
                                    {ecoNames[lib.ecosystem]}
                                  </span>
                                )}
                                <span style={{ fontSize: "9px", color: "#2a4060", marginLeft: "auto" }}>{lib.org}</span>
                              </div>

                              <div style={{ fontSize: "10px", color: "#4a6080", lineHeight: 1.5, marginBottom: "7px" }}>
                                {lib.desc}
                              </div>

                              <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", marginBottom: lib.capabilities?.length ? "8px" : 0 }}>
                                <div
                                  style={{
                                    display: "inline-block",
                                    fontSize: "9px",
                                    color: layer.accent,
                                    background: layer.accent + "12",
                                    border: `1px solid ${layer.accent}25`,
                                    padding: "2px 7px",
                                    borderRadius: "3px",
                                  }}
                                >
                                  {lib.use}
                                </div>
                                {appOnlyNames.has(lib.name) && lib.capabilities?.map((cap) => <CapabilityPill key={cap} capId={cap} />)}
                              </div>

                              {isSelected && (
                                <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: `1px solid ${layer.accent}25` }}>
                                  <div style={{ fontSize: "9px", color: "#3a5070", marginBottom: "5px", letterSpacing: "1px" }}>CONNECTED TO</div>
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                    {(relationshipMap[lib.name] || []).map((dep) => (
                                      <span key={dep} style={{ fontSize: "9px", color: "#f5a623", background: "#f5a62310", border: "1px solid #f5a62328", padding: "2px 7px", borderRadius: "3px" }}>
                                        {dep}
                                      </span>
                                    ))}
                                    {!relationshipMap[lib.name] && <span style={{ fontSize: "9px", color: "#1e3050" }}>—</span>}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px" }}>
            {layers
              .flatMap((l) => l.libs.map((lib) => ({ ...lib, layerId: l.id, layerAccent: l.accent, layerTitle: l.title })))
              .filter((lib) => !filterEco || lib.ecosystem === filterEco)
              .filter((lib) => !capabilityFilter || lib.layerId !== "application" || lib.capabilities?.includes(capabilityFilter))
              .map((lib) => {
                const ecoColor = lib.ecosystem ? ecoColors[lib.ecosystem] : null;
                return (
                  <div
                    key={`${lib.layerId}-${lib.name}`}
                    style={{
                      padding: "12px",
                      background: "#0d1b2a",
                      border: `1px solid #1a2a3a`,
                      borderTop: `2px solid ${lib.layerAccent}`,
                      borderRadius: "5px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "3px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: lib.layerAccent }}>{lib.name}</span>
                      {lib.hot && <span style={{ fontSize: "7px", color: "#ff6b6b", background: "#ff4d4d12", border: "1px solid #ff4d4d28", padding: "1px 4px", borderRadius: "2px" }}>HOT</span>}
                    </div>
                    {ecoColor && <div style={{ fontSize: "8px", color: ecoColor, marginBottom: "4px" }}>{ecoNames[lib.ecosystem]}</div>}
                    <div style={{ fontSize: "8px", color: "#2a4060", marginBottom: "6px" }}>{lib.layerTitle.split("/")[0]}</div>
                    <div style={{ fontSize: "9px", color: "#3a5575", lineHeight: 1.4, marginBottom: lib.capabilities?.length ? "8px" : 0 }}>
                      {lib.desc.length > 84 ? lib.desc.slice(0, 84) + "…" : lib.desc}
                    </div>
                    {lib.capabilities?.length ? (
                      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                        {lib.capabilities.map((cap) => <CapabilityPill key={cap} capId={cap} />)}
                      </div>
                    ) : null}
                  </div>
                );
              })}
          </div>
        )}

        <div style={{ marginTop: "36px", padding: "22px", background: "#0a1628", border: "1px solid #1a2a3a", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", color: "#4a6fa5", letterSpacing: "2px", marginBottom: "18px" }}>QUICK DECISION GUIDE</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "12px" }}>
            {[
              { q: "로컬에서 LLM 빠르게 실행", a: "Ollama → llama.cpp", color: "#52b788" },
              { q: "Apple Silicon Mac에서 실행", a: "MLX 또는 Ollama (llama.cpp)", color: "#74c69d" },
              { q: "프로덕션 GPU 서버 고성능 서빙", a: "vLLM 또는 SGLang", color: "#00b4d8" },
              { q: "LLM 파인튜닝 (소규모 빠르게)", a: "Unsloth + PEFT (QLoRA)", color: "#48cae4" },
              { q: "LLM 파인튜닝 (대규모 분산)", a: "Axolotl + DeepSpeed + Accelerate", color: "#f5a623" },
              { q: "RAG 시스템 구축", a: "LlamaIndex 또는 Haystack + Qdrant/pgvector", color: "#ff6eb4" },
              { q: "LLM 앱/에이전트 빠른 개발", a: "LangChain + LangGraph", color: "#e94560" },
              { q: "실험 추적/관리", a: "Weights & Biases 또는 MLflow", color: "#b98eff" },
              { q: "구조화 JSON 출력", a: "Instructor 또는 Guidance", color: "#ff9ccc" },
              { q: "멀티 에이전트 시스템", a: "LangGraph / CrewAI / AutoGen", color: "#ffc85c" },
              { q: "Hugging Face 모델 학습 코드 작성", a: "Transformers + Accelerate + PEFT", color: "#ff9d00" },
              { q: "MCP 기반 외부 도구 연동", a: "LangGraph / CrewAI / AutoGen / Semantic Kernel / DSPy", color: "#7dd3fc" },
            ].map((item) => (
              <div key={item.q} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "10px", color: "#4a6fa5" }}>▸ {item.q}</div>
                <div style={{ fontSize: "11px", color: item.color, fontWeight: 600, paddingLeft: "10px" }}>→ {item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

