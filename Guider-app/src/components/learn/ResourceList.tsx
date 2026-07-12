import type { Resource } from '../../types';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

interface ResourceListProps {
  resources: Resource[];
}

const platformColors: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info'> = {
  'React': 'info',
  'Docker': 'info',
  'Kubernetes': 'info',
  'Microsoft': 'info',
  'FreeCodeCamp': 'success',
  'MDN': 'warning',
  'Git': 'default',
};

const typeIcons: Record<string, string> = {
  documentation: '📄',
  video: '🎥',
  tutorial: '📝',
  interactive: '🎮',
  article: '📰',
};

export function ResourceList({ resources }: ResourceListProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Free Resources
      </h4>
      {resources.map((resource, i) => (
        <a
          key={i}
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Card hover className="flex items-start gap-3 !p-3">
            <span className="text-lg mt-0.5">{typeIcons[resource.type] || '📄'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {resource.title}
                </span>
                {resource.free && <Badge variant="success">Free</Badge>}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={platformColors[resource.platform] || 'default'}>
                  {resource.platform}
                </Badge>
                <span className="text-xs text-gray-400 capitalize">{resource.type}</span>
              </div>
            </div>
          </Card>
        </a>
      ))}
    </div>
  );
}
