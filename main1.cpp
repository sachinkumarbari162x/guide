#include <vulkan/vulkan.h>
#include <GLFW/glfw3.h>

#define GLM_FORCE_RADIANS
#define GLM_FORCE_DEFAULT_ALIGNED_GENTYPES
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>

#include <iostream>
#include <stdexcept>
#include <cstdlib>
#include <vector>
#include <array>    // <--- FIXED: Added this to fix "incomplete type std::array"
#include <cmath>
#include <chrono>   // <--- FIXED: Added this to fix time calculations

// --- FIXED: Added the UniformBufferObject struct definition ---
struct UniformBufferObject {
    alignas(16) glm::mat4 model;
    alignas(16) glm::mat4 view;
    alignas(16) glm::mat4 proj;
};

struct Vertex {
    glm::vec3 pos;
    glm::vec3 color;

    static VkVertexInputBindingDescription getBindingDescription() {
        VkVertexInputBindingDescription bindingDescription{};
        bindingDescription.binding = 0;
        bindingDescription.stride = sizeof(Vertex);
        bindingDescription.inputRate = VK_VERTEX_INPUT_RATE_VERTEX;
        return bindingDescription;
    }

    static std::array<VkVertexInputAttributeDescription, 2> getAttributeDescriptions() {
        std::array<VkVertexInputAttributeDescription, 2> attributeDescriptions{};
        attributeDescriptions[0].binding = 0;
        attributeDescriptions[0].location = 0;
        attributeDescriptions[0].format = VK_FORMAT_R32G32B32_SFLOAT;
        attributeDescriptions[0].offset = offsetof(Vertex, pos);

        attributeDescriptions[1].binding = 0;
        attributeDescriptions[1].location = 1;
        attributeDescriptions[1].format = VK_FORMAT_R32G32B32_SFLOAT;
        attributeDescriptions[1].offset = offsetof(Vertex, color);

        return attributeDescriptions;
    }
};

class ParticleSphereApp {
public:
    void run() {
        initWindow();
        initVulkan();
        mainLoop();
        cleanup();
    }

private:
    GLFWwindow* window;
    
    // --- FIXED: Defined the missing variables that caused errors ---
    VkExtent2D swapChainExtent = {800, 600}; // Default size
    std::vector<void*> uniformBuffersMapped; 
    std::vector<VkBuffer> uniformBuffers;
    std::vector<VkDeviceMemory> uniformBuffersMemory;
    
    const uint32_t PARTICLE_COUNT = 5000;
    std::vector<Vertex> vertices;

    void initWindow() {
        glfwInit();
        glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
        window = glfwCreateWindow(800, 600, "Vulkan Particle Sphere", nullptr, nullptr);
    }

    void initVulkan() {
        // NOTE: In a full app, you must create Instance, PhysicalDevice, LogicalDevice here.
        // I am calling loadModel to ensure the particle logic is ready.
        loadModel(); 
    }

    void loadModel() {
        vertices.resize(PARTICLE_COUNT);
        float phi = 3.14159265359f * (3.0f - std::sqrt(5.0f)); 

        for (uint32_t i = 0; i < PARTICLE_COUNT; i++) {
            float y = 1.0f - (i / float(PARTICLE_COUNT - 1)) * 2.0f;
            float radius = std::sqrt(1.0f - y * y);
            float theta = phi * i;

            float x = std::cos(theta) * radius;
            float z = std::sin(theta) * radius;

            vertices[i].pos = glm::vec3(x, y, z);
            
            float r = (y + 1.0f) * 0.5f;
            float b = 1.0f - r;
            vertices[i].color = glm::vec3(r, 0.2f, b);
        }
    }

    void updateUniformBuffer(uint32_t currentImage) {
        static auto startTime = std::chrono::high_resolution_clock::now();
        auto currentTime = std::chrono::high_resolution_clock::now();
        float time = std::chrono::duration<float, std::chrono::seconds::period>(currentTime - startTime).count();

        UniformBufferObject ubo{};
        
        // Rotate the sphere
        ubo.model = glm::rotate(glm::mat4(1.0f), time * glm::radians(45.0f), glm::vec3(0.0f, 0.0f, 1.0f));
        ubo.view = glm::lookAt(glm::vec3(2.0f, 2.0f, 2.0f), glm::vec3(0.0f, 0.0f, 0.0f), glm::vec3(0.0f, 0.0f, 1.0f));
        
        // FIXED: swapChainExtent is now defined, so this won't error
        ubo.proj = glm::perspective(glm::radians(45.0f), swapChainExtent.width / (float) swapChainExtent.height, 0.1f, 10.0f);
        ubo.proj[1][1] *= -1;

        // Note: In real code, you must ensure uniformBuffersMapped is allocated before accessing it
        if (!uniformBuffersMapped.empty()) {
            memcpy(uniformBuffersMapped[currentImage], &ubo, sizeof(ubo));
        }
    }

    void mainLoop() {
        while (!glfwWindowShouldClose(window)) {
            glfwPollEvents();
            // drawFrame(); // logic would go here
        }
    }

    void cleanup() {
        glfwDestroyWindow(window);
        glfwTerminate();
    }
};

int main() {
    ParticleSphereApp app;
    try {
        app.run();
    } catch (const std::exception& e) {
        std::cerr << e.what() << std::endl;
        return EXIT_FAILURE;
    }
    return EXIT_SUCCESS;
}