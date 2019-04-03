import {
  Bucket,
  Cell,
  Dashboard,
  Task,
  Telegraf,
  View,
  Document,
  Variable,
} from '../api'
import {Label as APILabel, DocumentListEntry} from '../api'

interface KV {
  [key: string]: string
}

export interface ILabelProperties extends KV {
  color: string
  description: string
}

export interface ILabel extends APILabel {
  properties: ILabelProperties
}

export interface ISetupParams {
  username: string
  password: string
  org: string
  bucket: string
}

export interface IBucket extends Bucket {
  labels: ILabel[]
}

export interface ITask extends Task {
  labels: ILabel[]
}

export interface ITelegraf extends Telegraf {
  labels: ILabel[]
}

export interface IVariable extends Variable {
  labels: ILabel[]
}

type DashboardPicked = Pick<Dashboard, 'orgID' | 'id' | 'name' | 'cells'>
type DashboardOriginal = Pick<
  Dashboard,
  Exclude<keyof Dashboard, 'orgID' | 'id' | 'name' | 'cells'>
>
type DashboardRequired = {[P in keyof DashboardPicked]-?: DashboardPicked[P]}

export interface IDashboard extends DashboardOriginal, DashboardRequired {
  labels: ILabel[]
}

export enum TemplateType {
  Label = 'label',
  Task = 'task',
  Dashboard = 'dashboard',
  View = 'view',
  Cell = 'cell',
  Variable = 'variable',
}

interface IKeyValuePairs {
  [key: string]: any
}

// Templates
interface ITemplateBase extends Document {
  content: {data: ITemplateData; included: ITemplateIncluded[]}
  labels?: ILabel[]
}

// TODO: be more specific about what attributes can be
interface ITemplateData {
  type: TemplateType
  attributes: IKeyValuePairs
  relationships: {[key in TemplateType]?: {data: IRelationship[]}}
}

interface ITemplateIncluded {
  type: TemplateType
  id: string
  attributes: IKeyValuePairs
}

// Template Relationships
type IRelationship =
  | ICellRelationship
  | ILabelRelationship
  | IViewRelationship
  | IVariableRelationship

interface ICellRelationship {
  type: TemplateType.Cell
  id: string
}

export interface ILabelRelationship {
  type: TemplateType.Label
  id: string
}

export interface IVariableRelationship {
  type: TemplateType.Variable
  id: string
}

interface IViewRelationship {
  type: TemplateType.View
  id: string
}

// Template Includeds
export interface IViewIncluded extends ITemplateIncluded {
  type: TemplateType.View
  attributes: View
}

export interface ICellIncluded extends ITemplateIncluded {
  type: TemplateType.Cell
  attributes: Cell
  relationships: {
    [TemplateType.View]: {data: IViewRelationship}
  }
}

export interface ILabelIncluded extends ITemplateIncluded {
  type: TemplateType.Label
  attributes: ILabel
}

export interface IVariableIncluded extends ITemplateIncluded {
  type: TemplateType.Variable
  attributes: Variable
}

export type ITaskTemplateIncluded = ILabelIncluded

export type IDashboardTemplateIncluded =
  | ICellIncluded
  | IViewIncluded
  | ILabelIncluded
  | IVariableIncluded

// Template Datas
interface ITaskTemplateData extends ITemplateData {
  type: TemplateType.Task
  attributes: {name: string; flux: string}
  relationships: {
    [TemplateType.Label]: {data: ILabelRelationship[]}
  }
}

interface IDashboardTemplateData extends ITemplateData {
  type: TemplateType.Dashboard
  attributes: IDashboard
  relationships: {
    [TemplateType.Label]: {data: ILabelRelationship[]}
    [TemplateType.Cell]: {data: ICellRelationship[]}
    [TemplateType.Variable]: {data: IVariableRelationship[]}
  }
}

// Templates
export interface ITaskTemplate extends ITemplateBase {
  content: {
    data: ITaskTemplateData
    included: ITaskTemplateIncluded[]
  }
}

export interface IDashboardTemplate extends ITemplateBase {
  content: {
    data: IDashboardTemplateData
    included: IDashboardTemplateIncluded[]
  }
}

export type ITemplate = ITaskTemplate | IDashboardTemplate

export interface TemplateSummary extends DocumentListEntry {
  labels: ILabel[]
}
