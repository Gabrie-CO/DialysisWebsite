<script lang="ts">
    // Since we don't have the shadcn button yet, use a standard button
</script>

<div class="flex h-screen w-full items-center justify-center bg-gray-50">
    <div
        class="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl text-center space-y-6"
    >
        <div class="space-y-2">
            <h1 class="text-3xl font-black text-gray-900">Sign In</h1>
            <p class="text-gray-500">Access the Dialysis Clinic Dashboard</p>
        </div>

        <!-- We use normal anchor to hit the server endpoint which redirects -->
        <a href="/auth/login" class="block w-full">
            <button
                class="w-full py-4 px-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
            >
                Sign in with WorkOS
            </button>
        </a>

        <div class="text-xs text-gray-400 mt-8">
            Authorized personnel only. All access is logged.
        </div>
    </div>
</div>
