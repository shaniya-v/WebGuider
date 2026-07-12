-- Migration 001: Initial schema setup
-- Run the main schema file

\i ../schema.sql

-- Seed data: Default topics
INSERT INTO topics (id, title, description, difficulty, estimated_duration, subtopics, resources, order_index) VALUES
  (
    'react',
    'React',
    'Build user interfaces with React',
    'beginner',
    '8 weeks',
    '["HTML", "CSS", "JavaScript", "React Basics", "Components", "Hooks", "State Management", "Projects"]',
    '[{"title": "Official Documentation", "url": "https://react.dev", "type": "documentation", "platform": "React", "free": true}, {"title": "FreeCodeCamp React", "url": "https://freecodecamp.org", "type": "tutorial", "platform": "FreeCodeCamp", "free": true}, {"title": "MDN Web Docs", "url": "https://developer.mozilla.org", "type": "documentation", "platform": "MDN", "free": true}]',
    1
  ),
  (
    'docker',
    'Docker',
    'Containerize applications with Docker',
    'intermediate',
    '4 weeks',
    '["Containers", "Images", "Dockerfile", "Docker Compose", "Networking", "Volumes", "Swarm"]',
    '[{"title": "Docker Docs", "url": "https://docs.docker.com", "type": "documentation", "platform": "Docker", "free": true}, {"title": "Play with Docker", "url": "https://labs.play-with-docker.com", "type": "interactive", "platform": "Docker", "free": true}]',
    2
  ),
  (
    'kubernetes',
    'Kubernetes',
    'Orchestrate containers at scale',
    'advanced',
    '6 weeks',
    '["Pods", "Services", "Deployments", "ConfigMaps", "Ingress", "Storage", "Helm"]',
    '[{"title": "K8s Docs", "url": "https://kubernetes.io/docs", "type": "documentation", "platform": "Kubernetes", "free": true}, {"title": "Play with K8s", "url": "https://labs.play-with-k8s.com", "type": "interactive", "platform": "Kubernetes", "free": true}]',
    3
  ),
  (
    'azure',
    'Azure',
    'Microsoft cloud platform',
    'intermediate',
    '8 weeks',
    '["Cloud Concepts", "Virtual Machines", "App Services", "Azure Functions", "Storage", "Networking", "Security"]',
    '[{"title": "Microsoft Learn", "url": "https://learn.microsoft.com/azure", "type": "tutorial", "platform": "Microsoft", "free": true}]',
    4
  ),
  (
    'git',
    'Git',
    'Version control system',
    'beginner',
    '2 weeks',
    '["Basics", "Branching", "Merging", "Rebasing", "Remotes", "Workflows", "Advanced"]',
    '[{"title": "Git SCM", "url": "https://git-scm.com/doc", "type": "documentation", "platform": "Git", "free": true}, {"title": "Learn Git Branching", "url": "https://learngitbranching.js.org", "type": "interactive", "platform": "Community", "free": true}]',
    5
  )
ON CONFLICT (id) DO NOTHING;
