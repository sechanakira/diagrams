<script>
    import {onMount} from "svelte";
    import {BpmnDiagrams, Diagram, DiagramContextMenu, SymbolPalette, UndoRedo} from '@syncfusion/ej2-diagrams';
    import {registerLicense} from '@syncfusion/ej2-base';
    import {addEvents} from '../scripts/diagram-common.js';

    onMount(() => {
        const licenseKey = 'ORg4AjUWIQA/Gnt2VVhhQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkBiUX9bc3xQQ2NfVUw=';
        registerLicense(licenseKey);

        Diagram.Inject(BpmnDiagrams, UndoRedo, DiagramContextMenu);
        SymbolPalette.Inject(BpmnDiagrams);

        //Create and add ports for node.
        function getPorts() {
            const ports = [
                {id: 'port1', shape: 'Circle', offset: {x: 0, y: 0.5}},
                {id: 'port2', shape: 'Circle', offset: {x: 0.5, y: 1}},
                {id: 'port3', shape: 'Circle', offset: {x: 1, y: .5}},
                {id: 'port4', shape: 'Circle', offset: {x: .5, y: 0}}
            ];
            return ports;
        }

//Sets the default values of a node
        function getNodeDefaults(node) {
            const obj = {};
            if (obj.width === undefined) {
                obj.width = 145;
            } else {
                const ratio = 100 / obj.width;
                obj.width = 100;
                obj.height *= ratio;
            }
            obj.style = {fill: '#357BD2', strokeColor: 'white'};
            obj.annotations = [{style: {color: 'white', fill: 'transparent'}}];
            //Set ports
            obj.ports = getPorts();
            return obj;
        }

//Sets the default values of a connector
        function getConnectorDefaults(obj) {
            if (obj.id.indexOf('connector') !== -1) {
                obj.type = 'Orthogonal';
                obj.targetDecorator = {shape: 'Arrow', width: 10, height: 10};
            }
            return obj;
        }

//Sets the Node style for DragEnter element.
        function dragEnter(args) {
            const obj = args.element;
            if (obj instanceof Node) {
                const oWidth = obj.width;
                const oHeight = obj.height;
                const ratio = 100 / obj.width;
                obj.width = 100;
                obj.height *= ratio;
                obj.offsetX += (obj.width - oWidth) / 2;
                obj.offsetY += (obj.height - oHeight) / 2;
                obj.style = {fill: '#357BD2', strokeColor: 'white'};
            }
        }

        function getFlowShape(id, shapeType) {
            const flowshape = {id: id, shape: {type: 'Flow', shape: shapeType}};
            return flowshape;
        }

        function getBasicShape(id, shapeType) {
            const basicShape = {id: id, shape: {type: 'Basic', shape: shapeType}};
            return basicShape;
        }

        function getBPMNShape(id, shapeType) {
            const basicShape = {id: id, shape: {type: 'Bpmn', shape: shapeType}};
            return basicShape;
        }

        function getSymbolDefaults(symbol) {
            symbol.style = {strokeColor: '#757575'};
            if (symbol.id === 'Terminator' || symbol.id === 'Process' || symbol.id === 'Delay') {
                symbol.width = 80;
                symbol.height = 40;
            } else if (symbol.id === 'Decision' || symbol.id === 'Document' || symbol.id === 'PreDefinedProcess' ||
                symbol.id === 'PaperTap' || symbol.id === 'DirectData' || symbol.id === 'MultiDocument' || symbol.id === 'Data') {
                symbol.width = 50;
                symbol.height = 40;
            } else {
                symbol.width = 50;
                symbol.height = 50;
            }
        }

        function getSymbolInfo(symbol) {
            return {fit: true};
        }

// tslint:disable-next-line:max-func-body-length
        const bounds = document.getElementById('diagram-space').getBoundingClientRect();
        const centerX = bounds.width / 2;
        const interval = [
            1, 9, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75, 0.25, 9.75
        ];
        const gridlines = {lineColor: '#e0e0e0', lineIntervals: interval};

// Initializes the nodes for the diagram
        const nodes = [
            {
                id: 'NewIdea', height: 60, offsetX: centerX - 50, offsetY: 80,
                shape: {type: 'Flow', shape: 'Terminator'}, annotations: [{content: 'Place Order'}]
            }, {
                id: 'Meeting', height: 60, offsetX: centerX - 50, offsetY: 160,
                shape: {type: 'Flow', shape: 'Process'}, annotations: [{content: 'Start Transaction'}]
            }, {
                id: 'BoardDecision', height: 60, offsetX: centerX - 50, offsetY: 240,
                shape: {type: 'Flow', shape: 'Process'}, annotations: [{content: 'Verification'}]
            }, {
                id: 'Project', height: 60, offsetX: centerX - 50, offsetY: 330,
                shape: {type: 'Flow', shape: 'Decision'}, annotations: [{content: 'Credit card valid?'}]
            }, {
                id: 'End', height: 60, offsetX: centerX - 50, offsetY: 430,
                shape: {type: 'Flow', shape: 'Decision'}, annotations: [{content: 'Funds available?'}]
            }, {
                id: 'node11', height: 60, offsetX: (centerX - 50) + 230, offsetY: 330,
                shape: {type: 'Flow', shape: 'Process'}, annotations: [{content: 'Enter payment method'}]
            }, {
                id: 'transaction_entered', height: 60, offsetX: (centerX - 50), offsetY: 630,
                shape: {type: 'Flow', shape: 'Terminator'}, annotations: [{content: 'Log transaction'}]
            }, {
                id: 'node12', height: 60, offsetX: (centerX - 50) + 180, offsetY: 630,
                shape: {type: 'Flow', shape: 'Process'}, annotations: [{content: 'Reconcile the entries'}]
            }, {
                id: 'transaction_completed', height: 60, offsetX: (centerX - 50), offsetY: 530,
                shape: {type: 'Flow', shape: 'Process'}, annotations: [{content: 'Complete Transaction'}]
            }, {
                id: 'Data',
                height: 45,
                offsetX: (centerX - 50) - 190,
                offsetY: 530,
                shape: {type: 'Flow', shape: 'Data'},
                annotations: [{content: 'Send e-mail', margin: {left: 25, right: 25}}]
            }, {
                id: 'node10',
                height: 70,
                offsetX: (centerX - 50) + 175,
                offsetY: 530,
                shape: {type: 'Flow', shape: 'DirectData'},
                annotations: [{content: 'Customer Database', margin: {left: 25, right: 25}}]
            },
        ];

//Initializes the connector for the diagram
        const connectors = [
            {id: 'connector1', sourceID: 'NewIdea', targetID: 'Meeting'},
            {id: 'connector2', sourceID: 'Meeting', targetID: 'BoardDecision'},
            {id: 'connector3', sourceID: 'BoardDecision', targetID: 'Project'},
            {
                id: 'connector4',
                sourceID: 'Project',
                annotations: [{content: 'Yes', style: {fill: 'white'}}],
                targetID: 'End'
            },
            {
                id: 'connector5', sourceID: 'End',
                annotations: [{content: 'Yes', style: {fill: 'white'}}], targetID: 'transaction_completed'
            },
            {id: 'connector6', sourceID: 'transaction_completed', targetID: 'transaction_entered'},
            {id: 'connector7', sourceID: 'transaction_completed', targetID: 'Data'},
            {id: 'connector8', sourceID: 'transaction_completed', targetID: 'node10'},
            {
                id: 'connector9',
                sourceID: 'node11',
                targetID: 'Meeting',
                segments: [{direction: 'Top', type: 'Orthogonal', length: 120}]
            },
            {
                id: 'connector10', sourceID: 'End', annotations: [{content: 'No', style: {fill: 'white'}}],
                targetID: 'node11', segments: [{direction: 'Right', type: 'Orthogonal', length: 100}]
            },
            {
                id: 'connector11',
                sourceID: 'Project',
                annotations: [{content: 'No', style: {fill: 'white'}}],
                targetID: 'node11'
            },
            {id: 'connector12', style: {strokeDashArray: '2,2'}, sourceID: 'transaction_entered', targetID: 'node12'}
        ];

//Initializes diagram control
        const diagram = new Diagram({
            width: '100%', height: '700px', nodes: nodes, connectors: connectors,
            snapSettings: {horizontalGridlines: gridlines, verticalGridlines: gridlines},
            //Sets the default values of a node
            getNodeDefaults: getNodeDefaults,
            //Sets the default values of a connector
            getConnectorDefaults: getConnectorDefaults,
            //Sets the Node style for DragEnter element.
            dragEnter: dragEnter
        });
        diagram.appendTo('#diagram');

//Initialize the flowshapes for the symbol palatte
        const flowShapes = [
            getFlowShape('Terminator', 'Terminator'),
            getFlowShape('Process', 'Process'),
            getFlowShape('Decision', 'Decision'),
            getFlowShape('Document', 'Document'),
            getFlowShape('PreDefinedProcess', 'PreDefinedProcess'),
            getFlowShape('PaperTap', 'PaperTap'),
            getFlowShape('DirectData', 'DirectData'),
            getFlowShape('SequentialData', 'SequentialData'),
            getFlowShape('Sort', 'Sort'),
            getFlowShape('MultiDocument', 'MultiDocument'),
            getFlowShape('Collate', 'Collate'),
            getFlowShape('Or', 'Or'),
            getFlowShape('Extract', 'Extract'),
            getFlowShape('Merge', 'Merge'),
            getFlowShape('OffPageReference', 'OffPageReference'),
            getFlowShape('SequentialAccessStorage', 'SequentialAccessStorage'),
            getFlowShape('Annotation', 'Annotation'),
            getFlowShape('Annotation2', 'Annotation2'),
            getFlowShape('Data', 'Data'),
            getFlowShape('Card', 'Card'),
            getFlowShape('Delay', 'Delay'),
        ];

        const basicShapes = [
            getBasicShape('Rectangle', 'Rectangle'),
            getBasicShape('Ellipse', 'Ellipse'),
            getBasicShape('Triangle', 'Triangle'),
            getBasicShape('Plus', 'Plus'),
            getBasicShape('Star', 'Star'),
            getBasicShape('Pentagon', 'Pentagon'),
            getBasicShape('Heptagon', 'Heptagon'),
            getBasicShape('Octagon', 'Octagon'),
            getBasicShape('Trapezoid', 'Trapezoid'),
            getBasicShape('Decagon', 'Decagon'),
            getBasicShape('RightTriangle', 'RightTriangle'),
            getBasicShape('Parallelogram', 'Parallelogram'),
        ];

        const bpmnShapes = [
            {
                id: 'Start Event',
                shape: {type: 'Bpmn', shape: 'Event', event: {event: 'Start', trigger: 'None'}},
                annotations: [
                    {content: 'Start Event'}
                ]
            },
            {
                id: 'Intermediate Event',
                shape: {type: 'Bpmn', shape: 'Event', event: {event: 'Intermediate', trigger: 'None'}},
                annotations: [
                    {content: 'Intermediate Event'}
                ]
            },
            {
                id: 'End Event',
                shape: {type: 'Bpmn', shape: 'Event', event: {event: 'End', trigger: 'None'}},
                annotations: [
                    {content: 'End Event'}
                ]
            },
            {
                id: 'Gateway',
                shape: {type: 'Bpmn', shape: 'Gateway'},
                annotations: [
                    {content: 'Gateway'}
                ]
            },
            {
                id: 'Task',
                shape: {type: 'Bpmn', shape: 'Activity', activity: {activity: 'Task'}},
                annotations: [
                    {content: 'Task'}
                ]
            },
            {
                id: 'Transaction',
                shape: {
                    type: 'Bpmn', shape: 'Activity', activity: {
                        activity: 'SubProcess',
                        subProcess: {
                            type: 'Transaction', transaction: {
                                success: {visible: false}, failure: {visible: false}, cancel: {visible: false}
                            }
                        }
                    },
                },
                annotations: [
                    {content: 'Transaction'}
                ]
            },
            {
                id: 'Message',
                shape: {type: 'Bpmn', shape: 'Message'}, annotations: [{content: 'Message'}]
            },
            {
                id: 'DataObject',
                shape: {type: 'Bpmn', shape: 'DataObject'}, annotations: [{content: 'Data Object'}]
            },
            {
                id: 'DataSource',
                shape: {type: 'Bpmn', shape: 'DataSource'}, annotations: [{content: 'Data Source'}]
            },
            {
                id: 'Group',
                shape: {type: 'Bpmn', shape: 'Group'}, annotations: [{content: 'Group'}]
            },
            {
                id: 'Text Annotation',
                shape: {type: 'Bpmn', shape: 'TextAnnotation'}, annotations: [{content: 'Text Annotation'}]
            }
        ];

        const activityMarkers = [
            {
                id: 'Sub-Process Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm300 300v50 1350h1400v-1400zm88 88h1224v1224h-1224zm522 212v310h-310v180h310v310h180v-310h310v-180h-310v-310z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Loop Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm1057.0703-536.8019c-251.96066-3.53538-493.62301 172.22866-565.93613 414.14756-55.58419 173.97657-23.10548 373.061 85.52208 520.0263-89.69531-17.3633-179.39063-34.7266-269.08594-52.0899-7.60156 39.2715-15.20313 78.543-22.80469 117.8145 161.28841 31.2213 322.57683 62.4427 483.86524 93.664 31.22917-159.9954 62.45833-319.9909 93.6875-479.9863-39.25977-7.6628-78.51953-15.3255-117.7793-22.9883-18.95378 97.1055-37.90755 194.2109-56.86133 291.3164-138.7329-165.6011-136.72949-427.77296 4.36682-591.37897 137.41756-171.71599 399.20335-221.00758 590.73365-114 183.2317 94.56792 284.8875 318.59636 234.8961 518.74577-44.7698 208.9108-247.4038 367.3398-460.604 363.0532-55.485-3.9353-83.37472 76.1957-37.4367 107.5608 40.1043 24.9864 90.8465 7.3636 134.8085 4.4747 248.1809-37.7478 457.5194-249.4518 489.5199-498.9095 36.9941-238.02524-91.3838-488.93562-304.8033-600.24159-86.1681-46.76847-184.0681-71.36408-282.0884-71.20867z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Parallel MI Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm500 400v1200h200v-1200zm400 0v1200h200v-1200zm400 0v1200h200v-1200z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Sequential MI Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm400 500v200h1200v-200zm0 400v200h1200v-200zm0 400v200h1200v-200z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Ad Hoc Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm300.00001 92.232481c58.33243-138.228514 134.89425-282.230651 266.546-360.085751 97.7838-58.39135 218.70131-22.41896 308.42844 34.81898 138.18715 85.20714 246.29115 211.842759 382.60565 299.507821 82.3352 48.264229 184.7331 8.717415 244.7474-58.0565283 72.4015-84.4454287 155.2156-164.0224627 197.6725-269.9809627v330.037636c-61.3313 121.670244-140.2313 248.152694-266.392 307.169314-103.2281 44.43963-223.1481 17.78892-312.5238-46.58565-131.01935-87.9789-227.48616-223.68984-369.85445-294.779603-69.17183-36.0046256-157.37678-27.5456121-215.33077 26.622558-104.48699 92.503835-164.36464 223.319945-235.89897 341.461865 0-103.37656 0-206.75312 0-310.129679z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Compensation Marker', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm1003.1719-427.54214c-39.60796 5.794-68.12868 38.56118-102.1447 57.51603-186.37683 125.49923-373.21723 250.34472-559.3042 376.25275-35.93279 27.59579-23.84863 86.43052 16.0756 103.58172 206.32507 138.4236 412.21958 277.524 618.81387 415.5246 41.83143 24.8132 96.65733-16.1808 88.32893-63.0759 0-105.8146 0-211.6291 0-317.4437 188.9638 126.7544 377.4965 254.1864 566.7296 380.5177 41.8315 24.8133 96.6575-16.1808 88.329-63.076-.2007-278.6032.4013-557.22646-.3009-835.81704-2.7279-48.53139-67.3754-71.26567-101.6214-38.12699-184.3787 123.91483-368.7575 247.82966-553.1363 371.74449-.7888-113.15884 1.5844-226.51615-1.1984-339.55004-5.2041-28.0178-32.0958-49.35538-60.5711-48.04762zm-58.23049 172.58399v614.78511c-152.46029-102.4642-304.92057-204.9283-457.38086-307.3925 152.46029-102.4642 304.92057-204.92841 457.38086-307.39261zm655.05859.00195v614.78126c-152.4603-102.4635-304.9206-204.9271-457.3809-307.3906 152.4603-102.46355 304.9206-204.92711 457.3809-307.39066z'
                },
                style: {fill:'black'}
            }
        ];

        const taskTypes = [
            {
                id: 'Send Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm198 484 802 454 802-454zm2 168v896h1604v-896l-804 448z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Receive Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm189 465v1070h1622v-1070zm167.88086 70h1286.23824l-643.1191 423.10547zm-97.88086 19.39648 741 487.49802 741-487.49802v910.60352h-1482z'
                },
                style: {fill:'black'}
            },
            {
                id: 'User Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm991.75 365c-177.27739 0-304.09741 136.28069-304.45312 291.51367v.0449.043c.0112 46.94485 12.71406 96.48986 32.56054 141.17774 14.33025 32.26709 32.14702 61.93151 53.85742 85.69531-129.02891 44.14326-280.19262 116.79528-356.59765 260.05468l-4.11719 7.7207v463.75h1157.5v-463.75l-4.1172-7.7207c-75.3061-141.1989-223.1988-213.74978-350.9805-258.07618 62.3794-63.43263 80.7808-145.30578 80.8008-228.85156v-.043-.0449c-.3557-155.23296-127.1757-291.51366-304.4531-291.51366zm-121.04102 165.29883c8.19443.0206 17.19117.29432 27.10938.8789 79.02308 4.65771 105.61894 18.88222 126.06254 32.37305 20.4435 13.49083 34.8553 26.33317 88.8828 27.9082h.016.018c42.1017-1.5748 62.3491-9.0811 76.8691-17.58398 5.8837-3.44545 10.8241-7.02722 15.8867-10.44727 13.3814 28.68227 20.5671 60.38893 20.6485 93.20313-.028 93.43999-16.0919 158.87652-101.7676 212.42383l8.3809 63.16992c17.8327 5.41537 36.2658 11.35733 54.9746 17.87305 2.6128 10.90011 5.6316 25.19633 7.6621 40.39453 2.1271 15.92241 2.9637 32.48881 1.6523 44.92771s-5.1734 19.1539-5.8515 19.8321c-43.5469 43.5468-120.8464 68.9433-199.252 68.9433-78.40557 0-155.70507-25.3965-199.25195-68.9433-.67811-.6782-4.54017-7.3932-5.85157-19.8321-1.31139-12.4389-.47481-29.0053 1.65235-44.92771 2.04162-15.28211 5.08445-29.66261 7.70703-40.58399 18.52194-6.44112 36.76978-12.32071 54.42969-17.68359l4.99609-67.6875c-4.068-5.21708-8.21297-8.67324-13.16016-12.38477-19.12128-14.34532-42.30994-45.90379-58.68945-82.78515-16.37367-36.86821-26.51791-79.00946-26.5332-112.74414.10174-40.44431 10.98577-79.211 30.97656-112.69727 3.57689-1.33139 7.34871-2.73853 11.58789-4.13281 14.90781-4.90324 35.33655-9.58342 70.8457-9.49414zm-151.34765 449.55664c-.0629.45883-.13379.90664-.19531 1.36719-2.58689 19.36354-4.10696 40.44054-1.88282 61.53714s7.79068 43.8102 25.96875 61.9882c62.04773 62.0478 155.95092 89.4473 248.74805 89.4473 92.7971 0 186.7003-27.3995 248.748-89.4473 18.1781-18.178 23.7447-40.8916 25.9688-61.9882 2.2241-21.0967.7041-42.1736-1.8828-61.53714-.051-.38161-.1102-.75238-.1621-1.13282 94.3337 41.36896 185.5148 100.61546 235.8281 189.07426v375.8359h-167.5v-265h-70v265h-544v-265h-70v265h-166v-375.8359c50.40811-88.6256 141.83798-147.9292 236.36133-189.30863z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Manual Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm919.37891 382.98828c-22.29906.00706-42.95289 8.25791-60.56641 19.61524l-.0293.01757-.02734.01953c-94.69375 61.31949-418.86736 286.29013-490.12695 335.20118l-.00196.00195h-.00195c-64.37124 44.19611-107.73286 110.90376-132.66211 189.93555l-.00391.01562-.0039.01367c-25.95238 82.51551-22.62204 172.40331-22.3711 247.68551l.00196.0196v.0195c.2548 56.6856 1.60618 106.1552 16.30859 166.1484.001.005.00291.0104.00391.0157 21.37286 87.802 62.76795 151.336 121.23047 190.2851 58.45984 38.9473 130.61411 52.7676 211.57421 53.0176 292.2834 1.0972 584.74108 1.4897 877.18168 0h.0254.0253c32.2087-.2112 62.9594-13.7524 82.1348-37.6777 19.174-23.9235 27.0167-54.865 27.4297-88.8106.2909-22.768-2.9107-44.287-10.3066-63.5117h32.375c31.5311 0 60.4337-8.984 81.1523-27.916 20.7116-18.9256 31.3044-44.6209 36.8086-71.6797v-.0078c7.6823-37.6398 4.0544-74.8065-10.916-105.9961 32.9456-2.6615 62.0332-15.1028 80.7402-37.9063 21.0232-25.6268 27.1474-58.2054 27.2559-92.7207.1144-36.0334-8.6292-70.42038-28.8125-97.76559-20.1832-27.34521-53.7714-45.95605-91.5664-46.00976h-.0098-.0117c-13.7592-.01148-26.1597.0083-41.7813 0 7.5167-18.74416 10.8211-39.82651 10.752-62.00586v-.05664-.05664c-.2278-35.77236-9.2509-69.9535-29.5352-97.12696-20.2839-27.17298-53.8081-45.75325-91.5859-45.7539-224.4198-.88552-446.2514 2.15695-634.90235 1.20312 9.83058-9.88493 19.37754-19.52498 29.87109-29.96094 32.48128-32.30302 63.69921-62.74271 79.82618-83.61132 38.55508-49.62243 44.30778-116.85168 11.84958-166.30469-17.11281-26.14334-42.20715-43.83194-69.15037-47.51367-3.36896-.46036-6.70793-.72065-10.01171-.79883v.00195c-.72271-.0171-1.44279-.02562-2.16211-.02539zm.54687 70.02734c.76807.00854 1.48528.06171 2.14844.15235 5.30527.72495 10.98561 2.6202 20.07031 16.50586l.01758.02539.01562.02539c12.69172 19.32635 12.13123 58.30528-8.62304 84.99219l-.03516.04492-.03515.04492c-7.54652 9.76975-41.45389 44.61588-73.81836 76.80274-32.36448 32.18686-63.13394 61.89553-78.35743 80.4414-14.55691 17.73388-9.21576 32.64732-5.26757 41.98242 3.94818 9.3351 8.46468 20.23668 28.59765 25.01953 6.02788 1.43196 6.35987 1.0198 8.28906 1.15235 1.9292.13255 3.92333.22394 6.26758.30859 4.6885.1693 10.68742.29739 18.09375.40625 226.46494 1.37916 450.42254-1.24061 676.70894-.91992h.0313.0312c17.2119 0 26.557 5.65704 35.4922 17.62695 8.9293 11.9619 15.4685 31.8133 15.6289 55.65235.066 24.73018-5.8566 39.81995-13.0566 48.13281-7.2 8.31282-16.8453 13.52059-37.4746 13.58789h-484.6504v70h484.7422.0488c66.4784.0062 101.5408-.04157 151.3633 0 17.3073.02951 26.5288 5.66165 35.3242 17.5781 8.7993 11.9217 15.2095 31.8268 15.1328 55.9746v.002c-.081 25.8227-5.3461 41.1958-11.375 48.5449-6.0288 7.3491-14.6381 12.732-39.4824 12.9024-8.4298.0578-68.8079.0136-93.8633.0429-.397-.005-.7856-.0417-1.1836-.0429-180.2265-.8506-360.4546-.002-540.6816-.002h-.0254l-.0254 70h.0254c.043 0 382.5167.2386 541.3301.0469 19.7.2791 31.5109 8.2106 40.9336 23.6015 9.5635 15.621 14.3232 40.1095 8.6797 67.7559v.0137.0136c-3.7364 18.3805-9.4126 28.473-15.4356 33.9766s-14.3345 9.5918-33.9336 9.5918c-180.5235-.0861-361.0445-.4522-541.5683 0h-.0918l.0918 70h.0918 409.3066.0156c14.7071.0958 21.2468 4.0084 27.961 12.9766 6.7142 8.9681 12.4394 25.6424 12.1308 49.6523v.0137.0117c-.2841 23.4116-5.9517 38.2716-12.0566 45.8887-6.1048 7.617-12.405 11.3569-27.9727 11.459-292.1234 1.4878-584.35596 1.0967-876.50974 0h-.01368-.01171c-73.05296-.2231-130.4559-12.9316-173-41.2754-42.55051-28.344-73.60769-72.8685-92.03907-148.5977l-.00781-.0293-.00586-.0293c-12.87021-52.4926-14.05921-94.0103-14.31055-149.8105v-.041c-.25565-76.5706-1.72448-160.0496 19.14649-226.40825 21.39186-67.80123 55.9877-119.25225 105.51172-153.25586l.0039-.00196c72.12455-49.50477 398.22899-275.65881 488.5-334.11914l.00391-.00195c8.47608-5.46474 15.49926-7.78869 20.71875-8.30273.87005-.08569 1.68897-.12182 2.45703-.11329z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Business Rule Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm178.10547 383v1234h1643.78903v-1234zm70 418h316.89453v344.4355h-316.89453zm386.89453 0h1116.8945v344.4355h-1116.8945zm-386.89453 414.4355h316.89453v331.5645h-316.89453zm386.89453 0h1116.8945v331.5645h-1116.8945z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Service Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm825.74609 438.17383c-.0463 36.99847.01021 73.9978.10547 110.99609-31.55327 8.92669-60.38632 21.3842-87.61523 36.64453l-79.58203-78.625-148.80664 149.66797 79.57617 78.61133c-15.37167 27.55154-27.37512 56.8307-35.75195 87.24219l-112.72461.20508v210.78908l113.90234-.4102c10.4159 41.2984 33.08461 78.4252 55.66211 111.6231v-181.82425l-99.56445.35742v-70.66211l99.06835-.17968 5.56055-28.17188c8.10952-41.08459 24.16986-80.24945 47.24414-115.29297l15.78516-23.97265-69.60352-68.76172 50.09375-50.38477 69.73047 68.89258 23.73047-15.83594c36.26386-23.92554 75.92787-39.96352 115.48047-48.31641l27.95898-5.80468-.25-96.78516h71.9668l-.55664 96.28125h28.42773 160.40622c-17.7134-21.14365-91.1204-48.65765-118.5078-56.32422l.6348-109.95703c-78.40004-.002-139.86546.00438-212.37111-.00195zm199.15821 201.6582.2871 110.99219c-31.55442 8.92669-60.38757 21.38251-87.61718 36.64453l-79.58399-78.625-148.80664 149.66797 79.57813 78.61133c-15.37235 27.55303-27.3771 56.83125-35.75391 87.24415l-112.72265.2031v210.7891l113.90039-.4082c8.96543 31.257 21.39414 59.7998 36.625 86.7461l-81.49414 81.1757 150.46484 147.879 81.20117-80.8243c27.8143 15.4447 57.38048 27.436 88.03318 35.7813l.0528 114.7129c72.3917.6338 149.467.3073 211.3359.3008v-116.0704c31.5778-8.9038 60.501-21.4509 87.7363-36.705l81.1348 79.9961 148.9043-149.4805-81.3047-80.1231c15.407-27.6256 27.4124-56.9537 35.7988-87.3984l110.3789-.6816v-210.586l-111.6172.6797c-8.9724-31.28698-21.2213-59.63676-36.6543-86.7617l77.1211-77.31836-150.3808-148.13086-77.0215 77.28515c-27.7003-15.31896-57.1463-27.28236-87.6797-35.63867l.6328-109.95703zm70.1797 70h71.9668l-.5547 96.2832 28.4258 5.57813c41.2724 8.09903 80.8306 24.13939 116.0156 47.07226l23.8242 15.5293 67.2168-67.44531 50.6172 49.86133-67.3105 67.48242 16.1953 23.90625c23.7647 35.87289 39.5283 74.64989 48.4277 114.58009l5.8555 28.0117 97.2812-.5918v70.5899l-96.7383.5957-5.5566 28.0117c-8.1598 41.1307-24.1851 80.2941-47.2988 115.3984l-15.8028 24.0059 71.2578 70.2226-50.0859 50.2793-71.2656-70.2656-23.6895 15.7383c-36.2752 23.7065-75.6246 40.1227-115.3242 48.2109l-28.1445 5.6211v102.2149c-19.241.0467-40.2309.0166-71.3692-.0274l-.0449-101.4492-28.2715-5.5215c-41.3301-8.0708-80.8232-24.0375-115.94723-47.0664l-23.7539-15.5742-71.54102 71.2109-50.625-49.7578 71.64063-71.3613-16.34766-24.0039c-23.78683-35.7942-39.5229-74.6123-48.4375-114.4961l-5.84961-27.9258-99.56445.3555v-70.6602l99.06836-.1816 5.56054-28.168c8.10958-41.0849 24.17017-80.25187 47.24414-115.29492l15.78516-23.97461-69.60547-68.76172 50.09375-50.38476 69.73242 68.89258 23.73047-15.83399c36.30986-23.76972 74.84087-39.54139 115.48047-48.31445l27.9609-5.80469zm37.166 257.20313c-86.6469 0-157.63867 70.99364-157.63867 157.64064s70.99177 157.6367 157.63867 157.6367 157.6387-70.9897 157.6387-157.6367-70.9918-157.64064-157.6387-157.64064zm0 70.00004c48.8162 0 87.6387 38.8245 87.6387 87.6406s-38.8225 87.6367-87.6387 87.6367-87.6367-38.8206-87.6367-87.6367 38.8205-87.6406 87.6367-87.6406z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Script Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm759.41016 378-8.26172 4.9043-2.69922 1.60351c-116.79146 69.21257-197.16482 132.67767-250.2207 194.65235-53.12936 62.06046-78.81652 124.54792-79.54688 184.78711-1.45347 119.88048 86.97228 209.71859 165.42578 290.06643 78.39382 80.2866 148.32259 156.0018 154.9043 218.664 3.35465 31.9387-4.19483 64.0189-39.01953 107.9434-34.67819 43.7398-97.61667 96.1282-198.24024 154.7851l-148.55859 86.5938h916.85354l10.8496-6.3125.0117-.0098c106.6354-62.1616 178.4767-119.591 224.2539-177.33 45.9137-57.9111 64.5936-118.4995 58.6191-175.3789-11.8376-112.702-103.6452-194.8266-180.8281-273.8731-77.2428-79.10787-139.8524-153.72081-139-224.02343.4304-35.49105 14.0718-75.08441 57.2188-125.48438 43.0731-50.31388 115.6956-109.18115 227.0312-175.1582v-.00196l145.8418-86.42773zm25.84179 92.91797h564.64255c-49.7292 37.07832-89.0484 72.89757-119.3066 108.24219-53.1293 62.06045-78.8165 124.54791-79.5469 184.78711-1.4534 119.88149 86.9766 209.71905 165.4297 290.06643 78.3934 80.2861 148.3166 156.0006 154.8984 218.664 3.3547 31.9388-4.1929 64.0189-39.0175 107.9434-33.3963 42.1228-93.4555 92.3857-187.7891 148.4609h-566.08984c39.27012-30.6267 70.46826-60.6354 94.33007-90.7324 45.91374-57.9111 64.59346-118.4995 58.61915-175.3789-11.83763-112.702-103.64524-194.8265-180.82813-273.87304-77.24277-79.10786-139.85041-153.72079-138.99805-224.02344.43032-35.49097 14.06988-75.0844 57.2168-125.48438 41.62668-48.62418 111.27423-105.34634 216.43945-168.67187zm-132.12109 158.47461v42.91992h441.39844v-42.91992zm-16.40234 231.17578v42.91797h456.38478v-42.91797zm206.79492 231.16994v42.9179h441.98826v-42.9179zm63.19726 231.1738v42.918h457.9863v-42.918z'
                },
                style: {fill:'black'}
            },
        ]

        const activities = [
            {
                id: 'Task', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm3.9882812 1034.5352c-1.8058997 0-3.27539058 1.4694-3.27539058 3.2753v8.961c0 1.8059 1.46949088 3.2754 3.27539058 3.2754h12.0468748c1.8059 0 3.275391-1.4695 3.275391-3.2754v-8.961c0-1.8059-1.469491-3.2753-3.275391-3.2753zm0 1.0332h12.0468748c1.251185 0 2.242188.991 2.242188 2.2421v8.961c0 1.2512-.991003 2.2422-2.242188 2.2422h-12.0468748c-1.2511848 0-2.2421874-.991-2.2421874-2.2422v-8.961c0-1.2511.9910026-2.2421 2.2421874-2.2421z'
                },
                style: {fill:'black'}
            },
        ]

        const images = [
            {
                id: 'Bus',
                shape: {
                    type: 'Image',
                    source: 'data:image/gif;base64,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'
                },
            },
            {
                id: 'Button',
                shape: {
                    type: 'HTML',
                    content: '<div style="background:#6BA5D7;height:100%;width:100%;"><button type="button" style="width:100px"> Button</button></div>'
                },
            },
        ]

        const flowIcons = [
            {
                id: 'Sequence Flow', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm1866.4062 206.6875s-585.4533 298.7241-882.8437 438.40625c63.7073 58.17752 122.9637 120.92602 184.4375 181.40625-302.3528 306.3874-604.7097 612.7689-907.0625 919.1562 22.17254 21.1599 44.32746 42.3089 66.5 63.4688 302.3528-306.3874 604.7097-612.7376 907.0625-919.125 61.5877 61.37036 122.8273 123.0865 184.4375 184.4375 158.8449-312.83114 447.4687-867.75 447.4687-867.75z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Default Flow', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm1866.4062 206.69141s-585.4532 298.72407-882.8437 438.40625c63.7073 58.17753 122.9637 120.926 184.4375 181.40625-187.96584 190.47409-375.93335 380.94569-563.90039 571.41799h-340.89063v88.0644h253.98633c-85.41926 86.558-170.83902 173.1153-256.25781 259.6739 22.17254 21.1599 44.32746 42.3108 66.5 63.4707 106.30042-107.7189 212.60127-215.4316 318.90234-323.1446h358.50586v-88.0644h-271.59765c167.08422-169.3025 334.16885-338.6053 501.25195-507.91799 61.5877 61.37037 122.8273 123.08649 184.4375 184.43749 158.8449-312.83119 447.4687-867.74999 447.4687-867.74999z'
                },
                style: {fill:'black'}
            },
            {
                id: 'Conditional Flow', width:100,height:100,offsetX:200, offsetY:200,
                shape: {
                    type: 'Path',
                    data: 'm1866.4062 206.69141s-585.4532 298.72407-882.8437 438.40625c63.7073 58.17753 122.9637 120.926 184.4375 181.40625-288.34237 292.18999-159.2904 166.97689-408.86133 420.39449l-428.29101 69.6036-82.20313 505.873 505.875-82.2012 4.91211-30.2363 64.67383-398.0137c251.54373-255.3955 121.48995-129.1602 410.39453-421.91989 61.5877 61.37037 122.8273 123.08649 184.4375 184.43749 158.8449-312.83119 447.4687-867.74999 447.4687-867.74999zm-1132.29682 1130.21479-53.66602 329.1836-329.1875 53.668 53.66797-329.375z',
                },
                style: {fill:'black'}
            },
        ]

//Initializes connector symbols for the symbol palette
        const connectorSymbols = [
            {
                id: 'Link1', type: 'Orthogonal', sourcePoint: {x: 0, y: 0}, targetPoint: {x: 60, y: 60},
                targetDecorator: {shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'}},
                style: {strokeWidth: 1, strokeColor: '#757575'}
            },
            {
                id: 'link3', type: 'Orthogonal', sourcePoint: {x: 0, y: 0}, targetPoint: {x: 60, y: 60},
                style: {strokeWidth: 1, strokeColor: '#757575'}, targetDecorator: {shape: 'None'}
            },
            {
                id: 'Link21', type: 'Straight', sourcePoint: {x: 0, y: 0}, targetPoint: {x: 60, y: 60},
                targetDecorator: {shape: 'Arrow', style: {strokeColor: '#757575', fill: '#757575'}},
                style: {strokeWidth: 1, strokeColor: '#757575'}
            },
            {
                id: 'link23', type: 'Straight', sourcePoint: {x: 0, y: 0}, targetPoint: {x: 60, y: 60},
                style: {strokeWidth: 1, strokeColor: '#757575'}, targetDecorator: {shape: 'None'}
            },
            {
                id: 'link33', type: 'Bezier', sourcePoint: {x: 0, y: 0}, targetPoint: {x: 60, y: 60},
                style: {strokeWidth: 1, strokeColor: '#757575'}, targetDecorator: {shape: 'None'}
            },
        ];

        const palettes = [
            {
                id: 'bpmnShapes',
                expanded: true,
                symbols: bpmnShapes,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'BPMN Shapes'
            },
            {
                id: 'activityMarkersShapes',
                expanded: true,
                symbols: activityMarkers,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'Activity Markers'
            },
            {
                id: 'bpmnFlowIcons',
                expanded: true,
                symbols: flowIcons,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'BPMN Flow Icons'
            },
            {
                id: 'taskTypeShapes',
                expanded: true,
                symbols: taskTypes,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'Task Types'
            },
            {
                id: 'activities',
                expanded: true,
                symbols: activities,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'Activities'
            },
            {
                id: 'htmlImages',
                expanded: true,
                symbols: images,
                iconCss: 'e-ddb-icons e-bpmn sans-serif',
                title: 'HTML Images'
            },
            {
                id: 'basicShapes',
                expanded: true,
                symbols: basicShapes,
                iconCss: 'e-ddb-icons e-basic',
                title: 'Basic Shapes'
            },
            {id: 'flow', expanded: true, symbols: flowShapes, iconCss: 'e-ddb-icons e-flow', title: 'Flow Shapes'},
            {
                id: 'connectors',
                expanded: true,
                symbols: connectorSymbols,
                iconCss: 'e-ddb-icons e-connector',
                title: 'Connectors'
            }
        ];

//Initializes the symbol palette
        const palette = new SymbolPalette({
            expandMode: 'Multiple', palettes: palettes,
            width: '100%', height: '700px', symbolHeight: 60, symbolWidth: 60,
            symbolMargin: {left: 15, right: 15, top: 15, bottom: 15},
            getNodeDefaults: getSymbolDefaults, getSymbolInfo: getSymbolInfo
        });

        palette.appendTo('#symbolpalette');

        addEvents();

    });

    export let diagramName;
</script>

<main>
    <h1>{diagramName}</h1>

    <div class="sb-mobile-palette-bar">
        <div class="e-ddb-icons1 e-toggle-palette" id="palette-icon" role="button" style="float: right;"></div>
    </div>
    <div class="sb-mobile-palette" id="palette-space">
        <div id="symbolpalette" style="width:90%;"></div>
    </div>
    <div class="sb-mobile-diagram" id="diagram-space">
        <div id="diagram"></div>
    </div>
</main>

<style>
    @font-face {
        font-family: 'e-ddb-icons';
        src: url(data:application/x-font-ttf;charset=utf-8;base64,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) format('truetype');
        font-weight: normal;
        font-style: normal;
    }

    .e-ddb-icons {
        font-family: 'e-ddb-icons';
        speak: none;
        font-size: 16px;
        font-style: normal;
        font-weight: normal;
        font-variant: normal;
        text-transform: none;
        line-height: 1;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }


    .e-basic::before {
        content: "\e726";
    }

    .e-flow::before {
        content: "\e724";
    }

    .e-connector::before {
        content: "\e725";
    }
</style>
