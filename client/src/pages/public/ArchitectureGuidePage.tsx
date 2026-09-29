import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  badge: string;
  content: React.ReactNode;
}

// ─── Reusable sub-components ─────────────────────────────────────────────────

function Badge({ label, color }: { label: string; color: string }) {
  const colors: Record<string, string> = {
    docker: 'bg-blue-50 text-blue-700 border-blue-200',
    backend: 'bg-amber-50 text-amber-700 border-amber-200',
    frontend: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    database: 'bg-purple-50 text-purple-700 border-purple-200',
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${colors[color] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
      {label}
    </span>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="text-xs font-mono bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
      {children}
    </code>
  );
}

function Block({ children }: { children: React.ReactNode }) {
  return (
    <pre className="bg-slate-950 text-slate-200 text-xs font-mono rounded-lg p-4 overflow-x-auto leading-relaxed whitespace-pre">
      {children}
    </pre>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-ink text-paper text-xs font-semibold flex items-center justify-center mt-0.5">
        {number}
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-ink mb-1">{title}</p>
        <div className="text-sm text-slate leading-relaxed space-y-2">{children}</div>
      </div>
    </div>
  );
}

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-2 border-signal pl-3 py-1 bg-amber-50/50 rounded-r">
      <p className="text-xs text-amber-800 leading-relaxed">{children}</p>
    </div>
  );
}

function FlowRow({ items, arrow = true }: { items: string[]; arrow?: boolean }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2 py-1 rounded">{item}</span>
          {arrow && i < items.length - 1 && <ChevronRight size={12} className="text-slate-400 flex-shrink-0" />}
        </span>
      ))}
    </div>
  );
}

// ─── Accordion item ───────────────────────────────────────────────────────────

function AccordionItem({ section }: { section: Section }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-line rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-paper hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Badge label={section.badge} color={section.badge.toLowerCase()} />
          <span className="font-display text-base font-medium text-ink">{section.title}</span>
        </div>
        {open ? <ChevronDown size={16} className="text-slate flex-shrink-0" /> : <ChevronRight size={16} className="text-slate flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-6 pt-2 border-t border-line space-y-5 bg-paper">
          {section.content}
        </div>
      )}
    </div>
  );
}

// ─── Section content definitions ─────────────────────────────────────────────

const sections: Section[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. Big picture overview
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'overview',
    title: 'Big Picture — How All Three Layers Fit Together',
    badge: 'docker',
    content: (
      <div className="space-y-5">
        <p className="text-sm text-slate leading-relaxed">
          ProjectHive is split into <strong className="text-ink">three separate processes</strong>, each with a clear job.
          They talk to each other over the network, not through shared memory or files.
        </p>

        {/* Three-box diagram */}
        <div className="grid md:grid-cols-3 gap-3 text-xs">
          <div className="border border-emerald-200 bg-emerald-50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-emerald-800">① React Frontend</p>
            <p className="text-emerald-700">Vite dev server on <Code>localhost:5173</Code></p>
            <p className="text-emerald-700">Runs in the <strong>browser</strong>. Displays UI, handles user input.</p>
          </div>
          <div className="border border-amber-200 bg-amber-50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-amber-800">② Express Backend</p>
            <p className="text-amber-700">Node.js on <Code>localhost:5000</Code></p>
            <p className="text-amber-700">Runs on the <strong>server</strong>. Validates, authorises, orchestrates DB ops.</p>
          </div>
          <div className="border border-purple-200 bg-purple-50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-purple-800">③ MongoDB Database</p>
            <p className="text-purple-700">Listens on <Code>localhost:27017</Code></p>
            <p className="text-purple-700">Stores all persistent data. <strong>Never</strong> talks to the browser directly.</p>
          </div>
        </div>

        <FlowRow items={['Browser (React)', 'HTTP / JSON', 'Express (Node)', 'Mongoose ODM', 'MongoDB']} />

        <p className="text-sm text-slate leading-relaxed">
          The browser <em>never</em> speaks to MongoDB. Every data operation travels through the Express backend first.
          This is how security is enforced — authentication, authorisation, and business rules all live in that middle layer.
        </p>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Docker
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'docker',
    title: 'Docker — How It Connects to the Backend',
    badge: 'docker',
    content: (
      <div className="space-y-5">
        <p className="text-sm text-slate leading-relaxed">
          Right now the project runs directly on your machine (<em>"bare metal"</em>). Docker would package the
          backend and database into <strong>containers</strong> — isolated mini-environments with everything
          they need baked in. Here's how that mapping works for ProjectHive:
        </p>

        <div className="space-y-3">
          <Step number={1} title="What a Container Is">
            <p>
              Think of a container as a lightweight box that contains Node.js, your compiled TypeScript,
              and all <Code>node_modules</Code> — so the app runs identically everywhere.
              No "works on my machine" problems.
            </p>
          </Step>

          <Step number={2} title="The Backend Dockerfile (conceptual)">
            <Block>{`# ① Choose a base image with Node 20
FROM node:20-alpine

# ② Set working directory inside the container
WORKDIR /app

# ③ Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# ④ Copy source code
COPY . .

# ⑤ Expose the port the Express server listens on
EXPOSE 5000

# ⑥ Start the dev server (ts-node-dev)
CMD ["npm", "run", "dev"]`}</Block>
            <Note>
              The <Code>EXPOSE 5000</Code> line matches the <Code>PORT=5000</Code> in the server's
              {' '}<Code>.env</Code> file (<Code>const PORT = process.env.PORT || 5000</Code>).
            </Note>
          </Step>

          <Step number={3} title="docker-compose connects everything">
            <Block>{`version: '3.8'
services:
  # ─── MongoDB ───────────────────────────────────────────────────────
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"          # host:container
    volumes:
      - mongo_data:/data/db    # data persists between restarts

  # ─── Express backend ───────────────────────────────────────────────
  server:
    build: ./server
    ports:
      - "5000:5000"
    environment:
      PORT: 5000
      # Docker's internal DNS — "mongo" resolves to the mongo container
      MONGO_URI: mongodb://mongo:27017/projecthive
      CLIENT_URL: http://localhost:5173
      JWT_SECRET: projecthive_secret_key_2026_super_secure
    depends_on:
      - mongo                  # wait for mongo to start first

volumes:
  mongo_data:`}</Block>
            <p>
              The key insight: when both services are in the same <Code>docker-compose</Code> network,
              the backend uses <Code>mongodb://mongo:27017</Code> instead of <Code>localhost:27017</Code>.
              Docker's internal DNS resolves the service name <Code>mongo</Code> to the container's IP.
            </p>
          </Step>

          <Step number={4} title="Data flow with Docker running">
            <FlowRow items={['Browser :5173', 'GET /api/projects', 'server container :5000', 'Mongoose', 'mongo container :27017']} />
          </Step>
        </div>

        <Note>
          The frontend (React + Vite) typically runs on your host machine and is NOT containerised during
          development — its <Code>VITE_API_URL=http://localhost:5000/api</Code> still points to port 5000,
          which Docker maps to the server container.
        </Note>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Backend → Frontend connection
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'backend-frontend',
    title: 'Backend ↔ Frontend — The Full Request Journey',
    badge: 'backend',
    content: (
      <div className="space-y-5">

        {/* CORS */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 0 — CORS: The Handshake Guard</p>
          <p className="text-sm text-slate mb-3">
            The browser will <em>refuse</em> to talk to a different origin unless the server explicitly
            allows it. In <Code>server/src/index.ts</Code>:
          </p>
          <Block>{`app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,          // allow cookies / auth headers
  })
);`}</Block>
          <p className="text-sm text-slate mt-2">
            This tells browsers: "Only requests coming from <Code>localhost:5173</Code> are trusted."
            Any other origin gets a <Code>403</Code> error — no data leaks to random websites.
          </p>
        </div>

        {/* Axios client */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 1 — The Axios Client (<Code>client/src/api/client.ts</Code>)</p>
          <p className="text-sm text-slate mb-3">
            Every API call in the frontend goes through one shared Axios instance.
            It does two automatic jobs:
          </p>
          <Block>{`// Read base URL from the Vite environment variable
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL });

// ① REQUEST interceptor — attach the JWT automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;  // from Zustand store
  if (token) config.headers.Authorization = \`Bearer \${token}\`;
  return config;
});

// ② RESPONSE interceptor — handle expired tokens globally
api.interceptors.response.use(
  (res) => res,          // success → just pass through
  (err) => {
    if (err.response?.status === 401) {
      useAuthStore.getState().logout();     // clear user session
      window.location.href = '/login';      // redirect to login
    }
    return Promise.reject(err);
  }
);`}</Block>
        </div>

        {/* Endpoints */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 2 — Typed Endpoints (<Code>client/src/api/endpoints.ts</Code>)</p>
          <p className="text-sm text-slate mb-3">
            All URL strings live in one <Code>EP</Code> object so there are no magic strings scattered across files:
          </p>
          <Block>{`export const EP = {
  authLogin:   '/auth/login',
  authRegister: '/auth/register',
  authMe:      '/auth/me',

  projects:    '/projects',
  project: (id: string) => \`/projects/\${id}\`,
  projectTasks:(id: string) => \`/projects/\${id}/tasks\`,
  // … and so on
} as const;`}</Block>
        </div>

        {/* API function example */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 3 — API Functions (<Code>client/src/api/auth.ts</Code> example)</p>
          <Block>{`// Calls POST http://localhost:5000/api/auth/login
export async function login(data: LoginPayload): Promise<AuthResponse> {
  const res = await api.post(EP.authLogin, data);
  return res.data.data;  // server always wraps in { success, data }
}`}</Block>
        </div>

        {/* React Query */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 4 — React Query caches the response</p>
          <p className="text-sm text-slate mb-3">
            Pages use <Code>@tanstack/react-query</Code> hooks so data is cached, de-duplicated, and
            automatically re-fetched when stale:
          </p>
          <Block>{`// Somewhere in a page component
const { data: projects, isLoading } = useQuery({
  queryKey: ['projects', filters],
  queryFn: () => getProjects(filters),   // calls api.get(EP.projects)
});`}</Block>
        </div>

        {/* Auth store */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Step 5 — The Auth State (<Code>client/src/store/authStore.ts</Code>)</p>
          <p className="text-sm text-slate mb-3">
            Zustand persists the JWT in <Code>localStorage</Code> so the user stays logged in across page refreshes:
          </p>
          <Block>{`export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      currentUser: null,
      login:  (token, user) => set({ token, currentUser: user }),
      logout: ()           => set({ token: null, currentUser: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token }), // only save token
    }
  )
);`}</Block>
          <Note>
            Only the token is persisted to localStorage — not the full user object.
            On every page load, the app re-fetches <Code>GET /api/auth/me</Code> to get fresh user data,
            using the stored token for authentication.
          </Note>
        </div>

        {/* Full round-trip */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Complete Round-Trip: Login</p>
          <div className="space-y-2">
            {[
              ['User fills form', 'LoginPage.tsx'],
              ['Calls login({ email, password })', 'api/auth.ts'],
              ['axios.post("/api/auth/login", body)', 'api/client.ts'],
              ['Express route validates credentials', 'server/routes/authRoutes.ts'],
              ['bcrypt.compare(password, hash)', 'authRoutes.ts'],
              ['jwt.sign({ id, role }, secret, "7d")', 'authRoutes.ts'],
              ['Returns { token, user }', 'HTTP 200 JSON'],
              ['useAuthStore.login(token, user)', 'authStore.ts'],
              ['Token saved → localStorage', 'Zustand persist'],
              ['Router redirects to /dashboard', 'router.tsx'],
            ].map(([action, file], i) => (
              <div key={i} className="flex items-start gap-3 text-xs">
                <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-500 text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="flex-1 text-slate">{action}</span>
                <Code>{file}</Code>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Auth middleware
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'auth-middleware',
    title: 'JWT Auth Middleware — How Protected Routes Work',
    badge: 'backend',
    content: (
      <div className="space-y-5">
        <p className="text-sm text-slate leading-relaxed">
          Most API routes require a logged-in user. The <Code>authenticateToken</Code> middleware
          in <Code>server/src/middleware/auth.ts</Code> runs before those route handlers.
        </p>

        <Block>{`export async function authenticateToken(req, res, next) {
  // 1. Pull token from the "Authorization: Bearer <token>" header
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'AUTH_REQUIRED' });

  // 2. Verify signature + expiry with the same secret used to sign it
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Load the full user document from MongoDB
  const user = await User.findById(decoded.id);
  if (!user)       return res.status(401).json({ error: 'NOT_FOUND' });
  if (user.suspended) return res.status(403).json({ error: 'SUSPENDED' });

  // 4. Attach user to req so route handlers can use it
  req.user = user;
  next();    // ← continue to the actual route handler
}`}</Block>

        <div className="grid sm:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-ink">Public routes (no middleware)</p>
            <p className="text-slate"><Code>GET /api/projects</Code> — browse projects</p>
            <p className="text-slate"><Code>POST /api/auth/login</Code> — get a token</p>
            <p className="text-slate"><Code>POST /api/auth/register</Code> — create account</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 space-y-1">
            <p className="font-semibold text-ink">Protected routes (middleware required)</p>
            <p className="text-slate"><Code>POST /api/projects</Code> — create project</p>
            <p className="text-slate"><Code>POST /api/tasks/:id/verify</Code> — award XP</p>
            <p className="text-slate"><Code>GET /api/auth/me</Code> — current user</p>
          </div>
        </div>

        <Note>
          Admin-only routes additionally call <Code>requireAdmin</Code>, which checks
          {' '}<Code>req.user.role === 'ADMIN'</Code> before allowing the request through.
        </Note>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Database operations
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'database',
    title: 'Database Operations — How & When MongoDB Is Hit',
    badge: 'database',
    content: (
      <div className="space-y-6">

        <p className="text-sm text-slate leading-relaxed">
          MongoDB is accessed exclusively through <strong>Mongoose</strong> — a library that maps
          JavaScript objects to MongoDB documents and provides a clean query API.
          The connection is established <em>once</em> at server startup.
        </p>

        {/* Connection */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">Connection Lifecycle (<Code>server/src/index.ts</Code>)</p>
          <Block>{`// MongoDB connection string from .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/projecthive';

mongoose
  .connect(MONGO_URI)                  // ← single persistent connection
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(\`Server on port \${PORT}\`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    // Server does NOT start if DB fails
  });`}</Block>
          <Note>
            The Express HTTP server only starts <em>after</em> MongoDB is connected.
            This prevents the API from serving requests when the database is unavailable.
          </Note>
        </div>

        {/* Schema */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">How Schemas Define the Data Shape</p>
          <p className="text-sm text-slate mb-3">
            Every collection has a Schema that acts as a contract — MongoDB is schemaless by default,
            but Mongoose enforces structure at the application layer:
          </p>
          <Block>{`// server/src/models/User.ts (simplified)
const UserSchema = new Schema<IUser>(
  {
    name:          { type: String, required: true, trim: true },
    email:         { type: String, required: true, unique: true, lowercase: true },
    passwordHash:  { type: String, required: true },
    role:          { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
    level:         { type: Number, default: 1 },
    xp:            { type: Number, default: 0 },
    suspended:     { type: Boolean, default: false },
    skills:        [{ skillId: String, proficiency: String, yearsExperience: Number }],
    // ...
  },
  { timestamps: true }  // adds createdAt + updatedAt automatically
);

export const User = mongoose.model<IUser>('User', UserSchema);
// ^ This creates a "users" collection in MongoDB (Mongoose pluralises it)`}</Block>
        </div>

        {/* Collections */}
        <div>
          <p className="text-sm font-semibold text-ink mb-2">All Collections in ProjectHive</p>
          <div className="grid sm:grid-cols-2 gap-2 text-xs">
            {[
              ['users', 'Accounts, XP, level, skills, availability'],
              ['projects', 'Titles, descriptions, status, owner ref, tech stack'],
              ['tasks', 'Work items with status lifecycle and XP rewards'],
              ['memberships', 'Which user belongs to which project + stats'],
              ['joinrequests', 'Pending/accepted/rejected applications to join'],
              ['xpevents', 'Audit log of every XP awarded and why'],
              ['notifications', 'In-app alerts for users'],
              ['reviews', 'Post-project peer reviews'],
              ['skills', 'Master list of skills (name, category)'],
              ['categories', 'Project category taxonomy'],
              ['auditlogs', 'Admin activity trail'],
            ].map(([name, desc]) => (
              <div key={name} className="flex gap-2 bg-slate-50 rounded px-3 py-2">
                <Code>{name}</Code>
                <span className="text-slate">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CRUD examples */}
        <div>
          <p className="text-sm font-semibold text-ink mb-3">Database Operations by Action</p>
          <div className="space-y-4">

            <div>
              <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">READ — Listing projects with filters</p>
              <Block>{`// GET /api/projects?search=react&difficulty=BEGINNER&page=1
const query: any = {};
if (search) query.$or = [
  { title:       { $regex: search, $options: 'i' } },
  { description: { $regex: search, $options: 'i' } },
];
if (difficulty) query.difficulty = difficulty;

const total = await Project.countDocuments(query);
const items = await Project
  .find(query)
  .sort({ createdAt: -1 })        // newest first
  .skip((page - 1) * limit)       // pagination offset
  .limit(limit);                  // page size`}</Block>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">CREATE — Registering a user</p>
              <Block>{`// POST /api/auth/register
const passwordHash = await bcrypt.hash(password, 10); // hashed, never plain

const user = await User.create({
  name,
  email: email.toLowerCase(),
  passwordHash,
  role: 'STUDENT',
  level: 1, xp: 0,
  projectCreationCredits: 0,
  unlockedCapabilities: ['JOIN_PROJECT'],
});
// MongoDB assigns a unique _id (ObjectId) automatically`}</Block>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">UPDATE — Awarding XP when a task is verified</p>
              <Block>{`// POST /api/tasks/:id/verify
// Step 1 — update task status
task.status = 'VERIFIED';
task.verifiedAt = new Date();
task.verifiedBy = req.user._id;
await task.save();                      // ← Mongoose: UPDATE tasks SET ...

// Step 2 — add XP to the assignee
const assignee = await User.findById(task.assignedTo);
assignee.xp += task.xpReward;          // e.g. 50 XP

// Step 3 — check for level-up
const newLevel = Math.floor(assignee.xp / 500) + 1;
if (newLevel > assignee.level) {
  assignee.level = newLevel;
  if (newLevel === 5) {
    assignee.unlockedCapabilities.push('PROJECT_OWNER');
    assignee.projectCreationCredits += 1;
  }
}
await assignee.save();                  // ← UPDATE users SET ...

// Step 4 — record the XP event for history
await XpEvent.create({
  userId:    assignee._id,
  amount:    task.xpReward,
  reason:    \`Task completed: \${task.title}\`,
  taskId:    task._id,
  projectId: task.projectId,
});                                     // ← INSERT INTO xpevents`}</Block>
              <Note>
                Three separate database writes happen atomically in one HTTP request.
                If any of them fail, the remaining saves are skipped and the client gets a 500 error.
              </Note>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">DELETE + BULK UPDATE — Deleting a project</p>
              <Block>{`// DELETE /api/projects/:id
// Find all active members
const memberships = await Membership.find({ projectId, status: 'ACTIVE' });
const memberIds   = memberships.map(m => m.userId);

// Bulk delete all memberships
await Membership.deleteMany({ projectId });

// Bulk decrement activeProjectCount on each member's user doc
await User.updateMany(
  { _id: { $in: memberIds } },
  { $inc: { activeProjectCount: -1 } }  // $inc = increment by negative = decrement
);

// Finally delete the project itself
await Project.deleteOne({ _id: projectId });`}</Block>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate uppercase tracking-wide mb-2">POPULATE — Joining data from multiple collections</p>
              <Block>{`// GET /api/projects/:id/members
// memberships.userId is just an ObjectId reference to a User document
const memberships = await Membership
  .find({ projectId })
  .populate('userId', 'name avatarUrl level xp');
  //         ^ field    ^ which fields to include from User collection

// Result: memberships[0].userId is now a full User object, not just an ID
// Mongoose translated:
//   SELECT m.*, u.name, u.avatarUrl, u.level, u.xp
//   FROM memberships m
//   JOIN users u ON m.userId = u._id`}</Block>
              <Note>
                MongoDB doesn't have SQL JOINs. Mongoose's <Code>.populate()</Code> performs a second
                query behind the scenes and merges the result — exactly like a JOIN but in application code.
              </Note>
            </div>

          </div>
        </div>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Task lifecycle
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'task-lifecycle',
    title: 'Task Lifecycle — Every Status Transition & DB Write',
    badge: 'database',
    content: (
      <div className="space-y-5">
        <p className="text-sm text-slate leading-relaxed">
          Tasks are the core unit of verified work. Each status transition involves an authenticated
          HTTP request and at least one database write.
        </p>

        <div className="space-y-3">
          {[
            {
              status: 'TODO',
              color: 'bg-slate-100 text-slate-700',
              who: 'Project owner creates the task',
              route: 'POST /api/projects/:id/tasks',
              db: 'Task.create({ status: "TODO", xpReward, assignedTo, ... })',
            },
            {
              status: 'IN_PROGRESS',
              color: 'bg-blue-100 text-blue-700',
              who: 'Assigned member picks it up',
              route: 'PUT /api/tasks/:id',
              db: 'task.status = "IN_PROGRESS"; await task.save()',
            },
            {
              status: 'SUBMITTED',
              color: 'bg-amber-100 text-amber-700',
              who: 'Member marks work as done',
              route: 'POST /api/tasks/:id/submit',
              db: 'task.status = "SUBMITTED"; task.submittedAt = new Date();',
            },
            {
              status: 'VERIFIED ✓',
              color: 'bg-emerald-100 text-emerald-700',
              who: 'Owner approves the submission',
              route: 'POST /api/tasks/:id/verify',
              db: 'task.save() + assignee.xp += xpReward + XpEvent.create()',
            },
            {
              status: 'REJECTED ✗',
              color: 'bg-red-100 text-red-700',
              who: 'Owner rejects with a comment',
              route: 'POST /api/tasks/:id/reject',
              db: 'task.status = "REJECTED"; task.verificationComment = comment;',
            },
          ].map((t, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className={`text-[10px] font-semibold px-2 py-1 rounded flex-shrink-0 ${t.color}`}>
                {t.status}
              </span>
              <div className="flex-1 text-xs space-y-0.5">
                <p className="text-ink font-medium">{t.who}</p>
                <p className="text-slate"><Code>{t.route}</Code></p>
                <p className="font-mono text-slate-500 text-[11px]">{t.db}</p>
              </div>
            </div>
          ))}
        </div>

        <Note>
          XP is awarded <em>only</em> at the VERIFIED step — never for merely submitting or creating a task.
          This is the system's core anti-gaming guarantee.
        </Note>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Response format
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'response-format',
    title: 'API Response Format — The Contract Between Backend & Frontend',
    badge: 'backend',
    content: (
      <div className="space-y-5">
        <p className="text-sm text-slate leading-relaxed">
          Every response from the Express server follows the same JSON envelope.
          The frontend always knows where to find data and where to find errors.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-semibold text-emerald-700 mb-2">✓ Success response</p>
            <Block>{`{
  "success": true,
  "data": {
    // the actual payload
    "_id": "...",
    "title": "My Project",
    "status": "OPEN"
  }
}`}</Block>
          </div>
          <div>
            <p className="text-xs font-semibold text-red-600 mb-2">✗ Error response</p>
            <Block>{`{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "That email or password
is incorrect."
  }
}`}</Block>
          </div>
        </div>

        <p className="text-sm text-slate leading-relaxed">
          The frontend's API functions unwrap this envelope, and the <Code>extractError</Code> utility
          in <Code>client/src/api/client.ts</Code> pulls out the typed error code for display in the UI.
        </p>

        <Block>{`// client/src/api/client.ts
export function extractError(err: unknown): { code: string; message: string } {
  if (axios.isAxiosError(err) && err.response?.data) {
    const d = err.response.data;
    if (!d.success && d.error) return d.error;  // typed error object
  }
  return { code: 'UNKNOWN', message: 'An unexpected error occurred.' };
}`}</Block>
      </div>
    ),
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 8. Routing
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: 'routing',
    title: 'Routing — How URLs Map to Pages and API Handlers',
    badge: 'frontend',
    content: (
      <div className="space-y-5">

        <div>
          <p className="text-sm font-semibold text-ink mb-2">Client-side routing (React Router)</p>
          <p className="text-sm text-slate mb-3">
            React Router DOM manages page navigation entirely in the browser — no full page reloads.
            The router config in <Code>client/src/routes/router.tsx</Code> has three tiers:
          </p>
          <div className="space-y-2 text-xs">
            {[
              { tier: 'Public', guard: 'None', paths: '/, /login, /register', bg: 'bg-slate-50' },
              { tier: 'Protected', guard: 'ProtectedRoute (needs token)', paths: '/dashboard, /explore, /projects/:id, …', bg: 'bg-emerald-50' },
              { tier: 'Admin', guard: 'AdminRoute (needs role=ADMIN)', paths: '/admin, /admin/users, /admin/projects', bg: 'bg-red-50' },
            ].map(r => (
              <div key={r.tier} className={`${r.bg} rounded-lg px-3 py-2 space-y-0.5`}>
                <p className="font-semibold text-ink">{r.tier}</p>
                <p className="text-slate">Guard: {r.guard}</p>
                <p className="text-slate">Paths: {r.paths}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink mb-2">Server-side routing (Express)</p>
          <p className="text-sm text-slate mb-3">
            Express mounts each route file under a prefix in <Code>server/src/index.ts</Code>:
          </p>
          <Block>{`app.use('/api/auth',         authRoutes);       // /api/auth/login, /me
app.use('/api/students',     studentRoutes);    // /api/students/:id
app.use('/api/projects',     projectRoutes);    // /api/projects, /:id/tasks
app.use('/api/tasks',        taskRoutes);       // /api/tasks/:id/verify
app.use('/api/join-requests',joinRequestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/admin',        adminRoutes);`}</Block>
        </div>

      </div>
    ),
  },
];

// ─── Main page component ──────────────────────────────────────────────────────

export function ArchitectureGuidePage() {
  return (
    <div className="min-h-screen bg-paper">

      {/* Nav */}
      <nav className="border-b border-line px-6 md:px-12 h-14 flex items-center justify-between">
        <span className="font-display text-lg font-semibold text-ink">ProjectHive</span>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-slate hover:text-ink transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>
      </nav>

      {/* Header */}
      <header className="px-6 md:px-12 py-12 border-b border-line max-w-4xl">
        <p className="text-xs font-semibold text-signal uppercase tracking-widest mb-3">Developer Guide</p>
        <h1 className="font-display text-3xl md:text-4xl font-medium text-ink leading-tight mb-4">
          How ProjectHive Works — Inside Out
        </h1>
        <p className="text-sm text-slate max-w-2xl leading-relaxed">
          A detailed walkthrough of how Docker connects to the backend, how the backend connects to the
          frontend, and exactly when and how every database operation runs. Based on the actual source code.
        </p>

        {/* Legend */}
        <div className="flex flex-wrap gap-2 mt-6">
          <Badge label="Docker" color="docker" />
          <Badge label="Backend" color="backend" />
          <Badge label="Frontend" color="frontend" />
          <Badge label="Database" color="database" />
        </div>
      </header>

      {/* Sections */}
      <main className="px-6 md:px-12 py-10 max-w-4xl space-y-3">
        {sections.map(section => (
          <AccordionItem key={section.id} section={section} />
        ))}
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-8 border-t border-line">
        <p className="text-xs text-slate">ProjectHive — Architecture reference based on the live codebase.</p>
      </footer>
    </div>
  );
}
