

export default function mockAuth(req, res, next) {
    // Simulate authenticated user
    req.user = {
        id: "mockUserId123",
        role: "admin"
    };
    next();
}