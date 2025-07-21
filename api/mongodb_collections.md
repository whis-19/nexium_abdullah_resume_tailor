# MongoDB Collections for Resume Tailor

## resumes
- **user_id**: string (Supabase user id)
- **job_description**: string
- **tailored_resume**: string (AI-generated resume)
- **timestamp**: ISODate

**Example:**
```json
{
  "user_id": "uuid-from-supabase",
  "job_description": "Senior Frontend Developer at Acme Corp...",
  "tailored_resume": "...AI-generated resume text...",
  "timestamp": "2024-06-01T12:00:00Z"
}
```

## job_descriptions
- **user_id**: string (Supabase user id)
- **description**: string

**Example:**
```json
{
  "user_id": "uuid-from-supabase",
  "description": "Senior Frontend Developer at Acme Corp..."
}
``` 