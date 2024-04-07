import React, { useEffect, useRef } from "react";
import './App.css';
import { initDemo } from "./helpers";
import * as cornerstoneTools from "@cornerstonejs/tools";
import * as cornerstone from "@cornerstonejs/core";
import { convertMultiframeImageIds } from "./helpers/convertMultiframeImageIds";
import * as cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";

// Destructure tools from CornerstoneJS
const {
    PanTool,
    LengthTool,
    WindowLevelTool,
    StackScrollMouseWheelTool,
    ZoomTool,
    PlanarRotateTool,
    ToolGroupManager,
    Enums: csToolsEnums,
} = cornerstoneTools;

// Initialize Cornerstone and related libraries
await initDemo();

// Add tools to Cornerstone
cornerstoneTools.addTool(PanTool);
cornerstoneTools.addTool(WindowLevelTool);
cornerstoneTools.addTool(StackScrollMouseWheelTool);
cornerstoneTools.addTool(ZoomTool);
cornerstoneTools.addTool(LengthTool);
cornerstoneTools.addTool(PlanarRotateTool);

const Viewer = () => {
    const contentRef = useRef(null);
    const renderingEngineRef = useRef(null);
    const viewport = useRef(null);

    const { MouseBindings } = csToolsEnums;

    useEffect(() => {
           run();
            const handleContextMenu = (event) => {
                event.preventDefault(); // Prevent the default context menu
            };
        
            // Add event listener to the contextmenu event
            document.addEventListener('contextmenu', handleContextMenu);
        
            // Cleanup function to remove the event listener when component unmounts
            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
            };
    
        
    }, []);

    async function run() {
        const toolGroupId = "STACK_TOOL_GROUP_ID";
        const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);

        // Add tools to the tool group
        toolGroup.addTool(WindowLevelTool.toolName);
        toolGroup.addTool(ZoomTool.toolName);
        toolGroup.addTool(LengthTool.toolName);
        toolGroup.addTool(StackScrollMouseWheelTool.toolName, { loop: true });
        toolGroup.addTool(PlanarRotateTool.toolName);

        // Set the initial state of the tools
        toolGroup.setToolActive(PlanarRotateTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Auxiliary }] // Middle Click
        });
        toolGroup.setToolActive(ZoomTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Primary }] // Right Click
        });
        toolGroup.setToolActive(LengthTool.toolName, {
            bindings: [{ mouseButton: MouseBindings.Secondary }] // Left Click
        });
        toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);

        // Instantiate a rendering engine
        const renderingEngineId = "myRenderingEngine";
        renderingEngineRef.current = new cornerstone.RenderingEngine(renderingEngineId);

        // Create a stack viewport
        const viewportId = "CT_STACK";
        const viewportInput = {
            viewportId: viewportId,
            element: contentRef.current,
            type: cornerstone.Enums.ViewportType.STACK,
        };

        renderingEngineRef.current.enableElement(viewportInput);

        // Set the tool group on the viewport
        toolGroup.addViewport(viewportId, renderingEngineId);

        viewport.current = renderingEngineRef.current.getViewport(viewportInput.viewportId);

        viewport.current.render();
    }

    const handleFileInputSelection = (evt) => {
        const files = evt.target.files;
        let imageIds = [];

        Array.from(files).forEach((file) => {
            imageIds.push(cornerstoneDICOMImageLoader.wadouri.fileManager.add(file));
        });

        loadAndViewImage(imageIds);
    };

    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const file = evt.dataTransfer.files[0];
        const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(file);

        loadAndViewImage(imageId);
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
    };

    const loadAndViewImage = async (imageIds) => {
        try {
            // Convert the imageId to a stack
            const stack = convertMultiframeImageIds(imageIds);

            // Set the stack on the viewport
            await viewport.current.setStack(stack);

            // Render the image
            viewport.current.render();
        } catch (error) {
            console.error("Error loading and viewing image:", error);
        }
    };

    return (
        <div className="medical-image-viewer-container">
            <h1 className="medical-image-viewer-heading">Medical Image Viewer</h1>

            <div className="file-input-container">
                <label htmlFor="fileInput" className="file-input-label">
                    Choose DICOM :
                </label>
                <button onClick={() => document.getElementById('fileInput').click()} className="file-input-button">
                    Choose File
                </button>
                <input
                    id="fileInput"
                    type="file"
                    accept=".dcm"
                    onChange={handleFileInputSelection}
                    multiple
                    className="file-input"
                />
            </div>

            <div
                id="content"
                className="image-content"
                onDragOver={handleDragOver}
                onDrop={handleFileSelect}
            >
                <div
                    id="cornerstone-element"
                    ref={contentRef}
                    className="image-viewer"
                ></div>
                <p className="instruction-text">
                    Middle Click: Rotation ,  Right Click: Length , Left Click: Zoom , Mouse Wheel: Stack Scroll.
                </p>
            </div>
        </div>
    );
};

export default Viewer;
