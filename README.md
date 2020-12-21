# Matrícula

Prefix - /api/v1

POST /auth/login

```typescript
// Input
{
	email: string,
	// 8 =< len =< 70
	password: string
}

// Output
{
	accessToken: string;
}
```

POST /auth/signup

```typescript
// Input
{
	email: string,
	// 8 =< len =< 70
	password: string,
	student_id: number,
	student_confirmation_code: number;
}
```

GET /courses

```typescript
{
	courses: {
		code: string;
		name: string;
		prerequisites: string[]
	}[]
}
```

GET /students/:id/completed-courses

```typescript
{
  courses: {
    code: string;
    name: string;
  }
  [];
}
```

GET /students/:id/completed-courses?codeOnly=true

```typescript
{
	courseCodes: string[]
}
```

GET /enrollment-requests

```typescript
{
	courseCodes: string[]
}
```

POST /enrollment-requests

```typescript
// Input
{
	courseCodes: string[]
}

// Output
{
	acceptedRequests: string[],
	rejectedRequets: string[]
}
```

DELETE /enrollment-requests:bulk

```typescript
// Input
{
	courseCodes: string[],
}

// Output
{
	deletedRequests: string[],
	rejectedDeletions: string[]
}
```
