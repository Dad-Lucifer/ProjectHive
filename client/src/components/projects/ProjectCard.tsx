import { Link } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';
import type { Project } from '../../types/project';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProjectStatusBadge } from './ProjectStatusBadge';
import { TechStackList } from './TechStackList';
import { MatchScoreBadge } from './MatchScoreBadge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

const difficultyVariant: Record<string, 'sky' | 'signal' | 'rust' | 'slate'> = {
  BEGINNER: 'sky',
  INTERMEDIATE: 'signal',
  ADVANCED: 'rust',
  EXPERT: 'ink' as 'slate',
};

interface ProjectCardProps {
  project: Project;
  showMatch?: boolean;
}

export function ProjectCard({ project, showMatch = true }: ProjectCardProps) {
  return (
    <Card className="flex flex-col gap-3 hover:border-slate/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-display font-medium text-ink leading-snug">{project.title}</h3>
        <ProjectStatusBadge status={project.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate">
        <Badge variant={difficultyVariant[project.difficulty] || 'slate'} size="sm">
          {project.difficulty}
        </Badge>
        <span className="flex items-center gap-1">
          <Users size={11} /> {project.memberCount}
        </span>
        {project.estimatedDurationWeeks && (
          <span className="flex items-center gap-1">
            <Clock size={11} /> {project.estimatedDurationWeeks}w
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate line-clamp-2">{project.description}</p>

      {/* Tech Stack */}
      {project.techStack.length > 0 && (
        <TechStackList items={project.techStack} max={5} />
      )}

      {/* Match + Actions */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-line">
        {showMatch && project.matchScore ? (
          <MatchScoreBadge score={project.matchScore} />
        ) : (
          <div className="flex items-center gap-2">
            {project.ownerName && (
              <Avatar name={project.ownerName} avatarUrl={project.ownerAvatarUrl} size="sm" />
            )}
            {project.ownerName && <span className="text-xs text-slate">{project.ownerName}</span>}
          </div>
        )}
        <Link
          to={`/projects/${project._id}`}
          className="inline-flex items-center justify-center gap-2 font-body font-medium rounded transition-colors text-xs px-3 py-1.5 bg-paper text-ink border border-line hover:bg-[#f0ede6] hover:border-slate select-none cursor-pointer"
        >
          View Project
        </Link>
      </div>
    </Card>
  );
}
