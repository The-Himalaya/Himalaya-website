"""
Startup wrapper to catch initialization errors and display them clearly.
Used for debugging Render deployment issues.
"""
import sys
import os
import traceback

try:
    import uvicorn
    from main import app
    
    # If we got here, the app loaded successfully
    print("[✓] App module loaded successfully", file=sys.stderr)
    
    # Run uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
    
except Exception as e:
    print(f"[✗] Failed to start app: {type(e).__name__}", file=sys.stderr)
    print(f"[✗] Error: {str(e)}", file=sys.stderr)
    traceback.print_exc()
    sys.exit(1)
