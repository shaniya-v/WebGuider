-- Seed data for Web-Guider

-- Insert sample tutorials for Explore mode
INSERT INTO tutorials (title, description, website_url, website_pattern, steps, category, difficulty, published) VALUES
  (
    'Create a GitHub Repository',
    'Step-by-step guide to creating a new repository on GitHub',
    'https://github.com',
    'github.com/*',
    '[
      {"id": "1", "instruction": "Click the + icon in the top-right corner", "selector": "[aria-label=\"Create new\"]", "action": "click"},
      {"id": "2", "instruction": "Select New repository", "selector": "a[href=\"/new\"]", "action": "click"},
      {"id": "3", "instruction": "Enter a repository name", "selector": "#repository_name", "action": "input", "value": "my-project"},
      {"id": "4", "instruction": "Choose repository visibility", "selector": "[name=\"repository_visibility\"]", "action": "click"},
      {"id": "5", "instruction": "Click Create repository", "selector": "button:contains(\"Create repository\")", "action": "click"}
    ]'::jsonb,
    'github',
    'beginner',
    TRUE
  ),
  (
    'Update LinkedIn Profile',
    'Guide to updating your professional profile on LinkedIn',
    'https://linkedin.com',
    'linkedin.com/*',
    '[
      {"id": "1", "instruction": "Click the Me icon", "selector": "[data-control-name=\"identity_profile_photo\"]", "action": "click"},
      {"id": "2", "instruction": "Select View Profile", "selector": "a[href*=\"/in/\"]", "action": "click"},
      {"id": "3", "instruction": "Click Edit", "selector": "button:contains(\"Edit\")", "action": "click"},
      {"id": "4", "instruction": "Update your headline", "selector": "#headline", "action": "input", "value": "Software Developer"},
      {"id": "5", "instruction": "Save changes", "selector": "button:contains(\"Save\")", "action": "click"}
    ]'::jsonb,
    'linkedin',
    'beginner',
    TRUE
  );
