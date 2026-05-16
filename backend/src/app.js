import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import swaggerUi from 'swagger-ui-express';
import { config } from './config/env.js';
import assignmentAuthRoutes from './routes/assignment.auth.routes.js';
import assignmentNotesRoutes from './routes/assignment.notes.routes.js';
import assignmentSearchRoutes from './routes/assignment.search.routes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { openApiSpec } from './docs/openapi.js';
import { sendSuccess } from './utils/response.js';
import { getAbout } from './controllers/about.controller.js';

const app = express();

app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: config.corsOrigin,
    credentials: true,
  }),
);
app.use(requestLogger);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());

app.use(apiLimiter);

app.get('/health', (_req, res) => {
  sendSuccess(res, { status: 'ok', timestamp: new Date().toISOString() }, 'Service is healthy');
});

app.get('/about', getAbout);

app.get('/openapi.json', (_req, res) => {
  res.json(openApiSpec);
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }));

app.use(assignmentAuthRoutes);
app.use('/notes', assignmentNotesRoutes);
app.use('/search', assignmentSearchRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
